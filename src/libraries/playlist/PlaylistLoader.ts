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
import BeatSaverAPI, { BeatSaverAPIResponseStatus } from '@/libraries/net/beatsaver/BeatSaverAPI';
import Progress from '@/libraries/common/Progress';

const PLAYLIST_EXTENSION_NAME = 'blist';

export default class PlaylistLoader {
  public static async Load(
    filepath: string,
    forceConvertIfNeeded: boolean = false,
    progress?: Progress,
  ) : Promise<PlaylistLocal | undefined> {
    if (!await fs.pathExists(filepath)) {
      return undefined;
    }

    const buffer = await fs.readFile(filepath);
    const oldFormat = await PlaylistLoader.IsOldFormat(buffer);
    let playlist: IPlaylist;

    if (oldFormat) {
      try {
        const legacyPlaylist = JSON.parse(buffer.toString());
        playlist = convertLegacyPlaylist(legacyPlaylist);
      } catch (e) {
        return undefined;
      }
    } else {
      playlist = await deserialize(buffer);
    }

    const output = await PlaylistLoader.ConvertToPlaylistLocal(playlist, progress);

    if (oldFormat && forceConvertIfNeeded) {
      await PlaylistLoader.ConvertPlaylistFile(filepath, output);
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
    const beatmap = await BeatSaverAPI.Singleton.getBeatmapByKey(key);

    if (beatmap.status === BeatSaverAPIResponseStatus.ResourceFound) {
      map.online = beatmap.data;
    } else {
      map.error = PlaylistMapImportError.BeatsaverRequestError;
    }
  }

  private static async HandleBeatmapHash(map: PlaylistLocalMap, hash: string) {
    const beatmap = await BeatSaverAPI.Singleton.getBeatmapByHash(hash);

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

  private static async ConvertPlaylistFile(filepath: string, playlist: PlaylistLocal) {
    const filename = `${path.parse(filepath).name}.${PLAYLIST_EXTENSION_NAME}`;
    const newFilepath = path.join(path.parse(filepath).dir, filename);
    const done = await this.Save(newFilepath, playlist);

    if (done) {
      await fs.unlink(filepath);
    }
  }
}
