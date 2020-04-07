import * as Throttle from 'promise-parallel-throttle';
import { BeatmapType, IBeatmap, IPlaylist } from 'blister.js';
import {
  PlaylistBase,
  PlaylistLocal,
  PlaylistLocalMap,
  PlaylistMapImportError,
} from '@/libraries/playlist/PlaylistLocal';
import BeatsaverAPI, { BeatSaverAPIResponse, BeatSaverAPIResponseStatus } from '@/libraries/net/beatsaver/BeatsaverAPI';
import Progress from '@/libraries/common/Progress';
import PlaylistLoadStateError from '@/libraries/playlist/loader/PlaylistLoadStateError';
import PlaylistBlisterLoader, {
  FILE_NOT_FOUND,
  INVALID_BLISTER_FORMAT,
  INVALID_JSON_FORMAT,
} from '@/libraries/playlist/loader/PlaylistBlisterLoader';
import { BeatsaverBeatmap } from '@/libraries/net/beatsaver/BeatsaverBeatmap';
import { IPlaylistSerializer } from '@/libraries/playlist/serializer/IPlaylistSerializer';
import BlisterSerializer from '@/libraries/playlist/serializer/BlisterSerializer';
import JsonSerializer from '@/libraries/playlist/serializer/JsonSerializer';
import PlaylistFormatType from '@/libraries/playlist/PlaylistFormatType';
import PlaylistFilenameExtension from '@/libraries/playlist/PlaylistFilenameExtension';
import store from '@/plugins/store';

const MAX_CONCURRENCY_ITEM = 25;

export default class PlaylistLoader {
  public static async Load(filepath: string, progress?: Progress)
    : Promise<PlaylistLocal> {
    try {
      const blisterLoaded = await PlaylistBlisterLoader.load(filepath);
      const output = await PlaylistLoader.ConvertToPlaylistLocal(blisterLoaded.playlist, progress);
      output.loadState = { valid: true, format: blisterLoaded.format };
      output.path = filepath;
      output.hash = blisterLoaded.hash;
      output.format = blisterLoaded.format;

      return output;
    } catch (e) {
      return this.handleError(e, filepath);
    }
  }

  public static async Save(playlist: PlaylistLocal, format?: PlaylistFormatType): Promise<void> {
    if (playlist.path === undefined) {
      throw new Error("this playlist doesn't contain a path");
    }

    format = format ?? playlist.format;
    await this.SaveAt(playlist.path, playlist, format);

    if (!PlaylistFilenameExtension.isExtensionCorrect(playlist.path, format)) {
      await PlaylistFilenameExtension.RenameTo(playlist.path, format);
    }
  }

  public static async SaveAt(filepath: string, playlist: PlaylistBase, format: PlaylistFormatType)
    : Promise<void> {
    let serializer: IPlaylistSerializer;

    switch (format) {
      case PlaylistFormatType.Json:
        serializer = new JsonSerializer();
        break;
      case PlaylistFormatType.Blister:
        serializer = new BlisterSerializer();
        break;
      default:
        throw new Error('Invalid playlist export format specified');
    }

    await serializer.serialize(playlist, filepath);
  }

  public static async update(oldPlaylist: PlaylistLocal, filepath: string, progress?: Progress)
    : Promise<PlaylistLocal> {
    try {
      const blisterLoaded = await PlaylistBlisterLoader.load(filepath);
      const output = {} as PlaylistLocal;

      output.title = blisterLoaded.playlist.title;
      output.author = blisterLoaded.playlist.author;
      output.description = blisterLoaded.playlist.description;
      output.cover = blisterLoaded.playlist.cover;
      output.hash = blisterLoaded.hash;
      output.path = filepath;
      output.maps = await this.getMissingMap(oldPlaylist, blisterLoaded.playlist, progress);
      output.loadState = { valid: true, format: blisterLoaded.format };
      output.format = blisterLoaded.format;

      return output;
    } catch (e) {
      return this.handleError(e, filepath);
    }
  }

  private static handleError(e: any, filepath: string) {
    switch (e) {
      case FILE_NOT_FOUND:
        return this.buildEmptyPlaylist(
          undefined,
          'The path doesn\'t exist',
          PlaylistLoadStateError.PathDoesntExist,
        );
      case INVALID_JSON_FORMAT:
        return this.buildEmptyPlaylist(
          filepath,
          e.message,
          PlaylistLoadStateError.FailedToParseOldFormat,
        );
      case INVALID_BLISTER_FORMAT:
        return this.buildEmptyPlaylist(
          filepath,
          e.message,
          PlaylistLoadStateError.FailedToParseNewFormat,
        );
      default:
        return this.buildEmptyPlaylist(
          filepath,
          e.message,
          PlaylistLoadStateError.Unknown,
        );
    }
  }

  private static async ConvertToPlaylistLocal(
    playlist: IPlaylist,
    progress: Progress = new Progress(),
  ): Promise<PlaylistLocal> {
    const output = {} as PlaylistLocal;

    progress.setTotal(playlist.maps.length);

    output.title = playlist.title;
    output.author = playlist.author;
    output.description = playlist.description;
    output.cover = playlist.cover;
    output.maps = await this.convertMapsFromBlister(playlist, progress);

    return output;
  }

  private static async convertMapsFromBlister(playlist: IPlaylist, progress: Progress)
    : Promise<PlaylistLocalMap[]> {
    return Throttle.all(
      playlist.maps.map((mapToConvert: IBeatmap) => async () => this
        .convertToLocalMap(mapToConvert)
        .then((map: PlaylistLocalMap) => {
          progress.plusOne();
          return map;
        })), { maxInProgress: MAX_CONCURRENCY_ITEM },
    );
  }

  private static async convertToLocalMap(mapToConvert: IBeatmap): Promise<PlaylistLocalMap> {
    const map = { dateAdded: mapToConvert.dateAdded, error: null } as PlaylistLocalMap;

    switch (mapToConvert.type) {
      case BeatmapType.Key:
        await PlaylistLoader.HandleBeatmapKey(map, mapToConvert.keyHex);
        break;

      case BeatmapType.Hash:
        await PlaylistLoader.HandleBeatmapHash(map, mapToConvert.hashHex);
        break;

      case BeatmapType.Zip:
        map.error = PlaylistMapImportError.BeatmapTypeZipNotSupported;
        break;

      case BeatmapType.LevelID:
        map.error = PlaylistMapImportError.BeatmapTypeLevelIdNotSupported;
        map.errorInfo = `levelid: ${mapToConvert.levelID}`;
        break;

      default:
        map.error = PlaylistMapImportError.BeatmapTypeUnknown;
        break;
    }

    return map;
  }

  private static async getMissingMap(
    oldPlaylist: PlaylistLocal,
    newPlaylist: IPlaylist,
    progress: Progress = new Progress(),
  ): Promise<PlaylistLocalMap[]> {
    progress.setTotal(newPlaylist.maps.length);

    return Throttle.all(newPlaylist.maps.map((map: IBeatmap) => async () => {
      const reusable = oldPlaylist.maps.find((oldMap: PlaylistLocalMap) => {
        switch (oldMap.error) {
          case null:
          case PlaylistMapImportError.BeatmapTypeZipNotSupported:
          case PlaylistMapImportError.BeatmapTypeLevelIdNotSupported:
          case PlaylistMapImportError.BeatmapTypeUnknown:
          case PlaylistMapImportError.BeatsaverInexistent:
            return false;

          case PlaylistMapImportError.BeatsaverRequestError:
          default:
            break;
        }

        switch (map.type) {
          case BeatmapType.Key:
            return map.keyHex === oldMap.online?.key;

          case BeatmapType.Hash:
            return map.hashHex === oldMap.online?.hash;

          case BeatmapType.Zip:
          case BeatmapType.LevelID:
          default:
            return false;
        }
      });

      progress.plusOne();

      if (reusable) {
        return reusable;
      }

      return this.convertToLocalMap(map);
    }), { maxInProgress: MAX_CONCURRENCY_ITEM });
  }

  private static async HandleBeatmapKey(map: PlaylistLocalMap, key: string) {
    const beatmap = await BeatsaverAPI.Singleton.getBeatmapByKey(key);
    this.SetMapOnlineData(beatmap, map);

    if (map.error) {
      map.errorInfo = `key: ${key}`;
    }
  }

  private static async HandleBeatmapHash(map: PlaylistLocalMap, hash: string) {
    const beatmap = await BeatsaverAPI.Singleton.getBeatmapByHash(hash);
    this.SetMapOnlineData(beatmap, map);

    if (map.error) {
      map.errorInfo = `hash: ${hash}`;
    }
  }

  private static SetMapOnlineData(
    beatmap: BeatSaverAPIResponse<BeatsaverBeatmap>,
    map: PlaylistLocalMap,
  ): void {
    map.error = null;
    map.online = null;

    if (beatmap.status === BeatSaverAPIResponseStatus.ResourceFound) {
      map.online = beatmap.data;
    } else if (beatmap.status === BeatSaverAPIResponseStatus.ResourceNotFound) {
      map.error = PlaylistMapImportError.BeatsaverInexistent;
    } else {
      map.error = PlaylistMapImportError.BeatsaverRequestError;
    }
  }

  private static buildEmptyPlaylist(
    filepath: string | undefined,
    message: string,
    errorType: PlaylistLoadStateError,
  ): PlaylistLocal {
    const format = store.getters['settings/defaultExportFormat'] as PlaylistFormatType;
    return {
      author: '',
      cover: null,
      description: null,
      maps: [],
      title: '',
      path: filepath,
      hash: undefined,
      loadState: {
        valid: false,
        errorMessage: message,
        errorType,
        format: undefined,
      },
      format,
    } as PlaylistLocal;
  }
}
