import fs from 'fs-extra';
import path from 'path';
import * as Throttle from 'promise-parallel-throttle';
import { BeatmapType, IBeatmap, IPlaylist } from 'blister.js';
import {
  PlaylistBase,
  PlaylistLocal,
  PlaylistLocalMap,
  PlaylistMapImportError,
  PlaylistOnlineMap,
} from '@/libraries/playlist/PlaylistLocal';
import BeatsaverAPI, { BeatSaverAPIResponseStatus } from '@/libraries/net/beatsaver/BeatsaverAPI';
import Progress from '@/libraries/common/Progress';
import PlaylistLoadStateError from '@/libraries/playlist/PlaylistLoadStateError';
import PlaylistBlisterLoader, {
  FILE_NOT_FOUND,
  INVALID_BLISTER_FORMAT,
  INVALID_JSON_FORMAT,
} from '@/libraries/playlist/loader/PlaylistBlisterLoader';

const MAX_CONCURRENCY_ITEM = 25;
export const PLAYLIST_EXTENSION_NAME: string = 'blist';

export default class PlaylistLoader {
  public static async Load(filepath: string, forceConvert: boolean = false, progress?: Progress)
    : Promise<PlaylistLocal> {
    try {
      const blisterLoaded = await PlaylistBlisterLoader.load(filepath);
      const output = await PlaylistLoader.ConvertToPlaylistLocal(blisterLoaded.playlist, progress);
      output.loadState = { valid: true, hasBeenConverted: false };

      if (blisterLoaded.format === 'json' && forceConvert) {
        const newFilePath = await PlaylistLoader.ConvertPlaylistFile(filepath, output);
        if (newFilePath) {
          filepath = newFilePath;
          output.loadState.hasBeenConverted = true;
        }
      }

      output.path = filepath;
      output.hash = blisterLoaded.hash;

      return output;
    } catch (e) {
      return this.handleError(e, filepath);
    }
  }

  public static async Save(playlist: PlaylistLocal): Promise<void> {
    if (playlist.path === undefined) {
      throw new Error("this playlist doesn't contain a path");
    }

    await this.SaveAt(playlist.path, playlist);
  }

  public static async SaveAt(filepath: string, playlist: PlaylistBase): Promise<void> {
    const blisterPlaylist = await PlaylistLoader.ConvertToPlaylistBlister(playlist);
    await PlaylistBlisterLoader.write(blisterPlaylist, filepath);
  }

  // TODO add progress
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
      output.loadState = { valid: true, hasBeenConverted: false };

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
        if (oldMap.error !== null) {
          return false;
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

    if (beatmap.status === BeatSaverAPIResponseStatus.ResourceFound) {
      map.online = beatmap.data;
    } else {
      map.error = PlaylistMapImportError.BeatsaverRequestError;
    }
  }

  private static async HandleBeatmapHash(map: PlaylistLocalMap, hash: string) {
    const beatmap = await BeatsaverAPI.Singleton.getBeatmapByHash(hash);

    if (beatmap.status === BeatSaverAPIResponseStatus.ResourceFound) {
      map.online = beatmap.data;
    } else {
      map.error = PlaylistMapImportError.BeatsaverRequestError;
    }
  }

  private static async ConvertToPlaylistBlister(playlist: PlaylistBase): Promise<IPlaylist> {
    const output = {} as IPlaylist;

    output.title = playlist.title;
    output.author = playlist.author;
    output.description = playlist.description;
    output.cover = playlist.cover;

    output.maps = playlist.maps.map((map: PlaylistLocalMap | PlaylistOnlineMap) => {
      if (map.online === undefined) {
        return undefined;
      }

      const hash = map.online?.hash || '';
      return {
        dateAdded: map.dateAdded,
        type: BeatmapType.Hash,
        hash: Buffer.from(hash.toLowerCase(), 'hex'),
      } as IBeatmap;
    }).filter((map: IBeatmap | undefined) => map !== undefined) as IBeatmap[];

    return output;
  }

  private static async ConvertPlaylistFile(filepath: string, playlist: PlaylistLocal)
    : Promise<string | undefined> {
    const filename = `${path.parse(filepath).name}.${PLAYLIST_EXTENSION_NAME}`;
    const newFilepath = path.join(path.parse(filepath).dir, filename);

    try {
      await this.SaveAt(newFilepath, playlist);
      await fs.unlink(filepath);
      return newFilepath;
    } catch (e) {
      return undefined;
    }
  }

  private static buildEmptyPlaylist(
    filepath: string | undefined,
    message: string,
    errorType: PlaylistLoadStateError,
  ): PlaylistLocal {
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
      },
    } as PlaylistLocal;
  }
}
