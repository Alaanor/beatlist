import fs from 'fs-extra';
import path from 'path';
import {
  BeatmapType,
  convertLegacyPlaylist,
  deserialize,
  IBeatmap,
  IPlaylist,
  magicNumber,
  serialize,
} from 'blister.js';
import * as Throttle from 'promise-parallel-throttle';
import { PlaylistLocal, PlaylistLocalMap, PlaylistMapImportError } from '@/libraries/playlist/PlaylistLocal';
import BeatsaverAPI, { BeatSaverAPIResponseStatus } from '@/libraries/net/beatsaver/BeatsaverAPI';
import Progress from '@/libraries/common/Progress';
import PlaylistLoadStateError from '@/libraries/playlist/PlaylistLoadStateError';

const PLAYLIST_EXTENSION_NAME = 'blist';

export default class PlaylistLoader {
  public static async Load(
    filepath: string,
    forceConvertIfNeeded: boolean = false,
    progress?: Progress,
  ) : Promise<PlaylistLocal> {
    if (!await fs.pathExists(filepath)) {
      return this.buildEmptyPlaylist(
        filepath,
        'The path doesn\'t exist',
        PlaylistLoadStateError.PathDoesntExist,
      );
    }

    const buffer = await fs.readFile(filepath);
    const oldFormat = await PlaylistLoader.IsOldFormat(buffer);
    let playlist: IPlaylist;

    if (oldFormat) {
      try {
        const legacyPlaylist = JSON.parse(buffer.toString());
        playlist = convertLegacyPlaylist(legacyPlaylist);
      } catch (e) {
        return this.buildEmptyPlaylist(
          filepath,
          e.message,
          PlaylistLoadStateError.FailedToParseOldFormat,
        );
      }
    } else {
      try {
        playlist = await deserialize(buffer);
      } catch (e) {
        return this.buildEmptyPlaylist(
          filepath,
          e.message,
          PlaylistLoadStateError.FailedToParseNewFormat,
        );
      }
    }

    const output = await PlaylistLoader.ConvertToPlaylistLocal(playlist, progress);
    output.loadState = { valid: true, hasBeenConverted: false };

    if (oldFormat && forceConvertIfNeeded) {
      const newFilePath = await PlaylistLoader.ConvertPlaylistFile(filepath, output);
      if (newFilePath) {
        filepath = newFilePath;
        output.loadState.hasBeenConverted = true;
      }
    }

    output.path = filepath;

    return output;
  }

  public static async Save(filepath: string, playlist: PlaylistLocal): Promise<boolean> {
    try {
      const blisterPlaylist = await PlaylistLoader.ConvertToPlaylistBlister(playlist);
      const buffer = await serialize(blisterPlaylist);
      await fs.writeFile(filepath, buffer);
    } catch (e) {
      return false;
    }

    return true;
  }

  private static async IsOldFormat(buffer: Buffer) {
    return buffer.slice(0, magicNumber.length).toString() !== magicNumber.toString();
  }

  private static async ConvertToPlaylistLocal(
    playlist: IPlaylist,
    progress: Progress = new Progress(),
  ): Promise<PlaylistLocal> {
    const output = {} as PlaylistLocal;

    output.title = playlist.title;
    output.author = playlist.author;
    output.description = playlist.description;
    output.cover = playlist.cover;

    progress.setTotal(playlist.maps.length);

    output.maps = await Throttle.all(playlist.maps.map((mapToConvert: IBeatmap) => async () => {
      const map = { dateAdded: mapToConvert.dateAdded } as PlaylistLocalMap;

      switch (mapToConvert.type) {
        case BeatmapType.Key:
          await PlaylistLoader.HandleBeatmapKey(map, mapToConvert.key.toString(16));
          break;

        case BeatmapType.Hash:
          await PlaylistLoader.HandleBeatmapHash(map, mapToConvert.hash.toString('hex'));
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

      progress.plusOne();

      return map;
    }), { maxInProgress: 25 });

    return output;
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

  private static async ConvertToPlaylistBlister(playlist: PlaylistLocal): Promise<IPlaylist> {
    const output = {} as IPlaylist;

    output.title = playlist.title;
    output.author = playlist.author;
    output.description = playlist.description;
    output.cover = playlist.cover;

    output.maps = playlist.maps.map((map: PlaylistLocalMap) => {
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
    const done = await this.Save(newFilepath, playlist);

    if (done) {
      await fs.unlink(filepath);
      return newFilepath;
    }

    return undefined;
  }

  private static buildEmptyPlaylist(
    filepath: string,
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
      loadState: {
        valid: false,
        errorMessage: message,
        errorType,
      },
    } as PlaylistLocal;
  }
}
