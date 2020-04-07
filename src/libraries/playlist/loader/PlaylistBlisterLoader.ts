import {
  convertLegacyPlaylist, deserialize, IBeatmap, IPlaylist, magicNumber,
} from 'blister.js';
import fs from 'fs-extra';
import crypto from 'crypto';
import PlaylistFormatType from '@/libraries/playlist/PlaylistFormatType';

export const FILE_NOT_FOUND: Error = new Error('File not found');
export const INVALID_JSON_FORMAT: Error = new Error('invalid json format');
export const INVALID_BLISTER_FORMAT: Error = new Error('invalid blister format');

export default class PlaylistBlisterLoader {
  public static async load(filepath: string): Promise<PlaylistBlisterLoaded> {
    await this.checkFileExist(filepath);

    let playlist: IPlaylist;
    const buffer = await fs.readFile(filepath);
    const oldFormat = await this.isOldFormat(buffer);

    if (oldFormat) {
      playlist = this.readLegacy(buffer);
    } else {
      playlist = await this.readBlister(buffer);
    }

    return {
      playlist,
      format: oldFormat ? PlaylistFormatType.Json : PlaylistFormatType.Blister,
      hash: this.computeHash(playlist, filepath),
      filepath,
    } as PlaylistBlisterLoaded;
  }

  public static computeHash(playlist: IPlaylist, filepath: string): string {
    const safeEmptyPlaylist = {} as IPlaylist;
    safeEmptyPlaylist.title = playlist.title;
    safeEmptyPlaylist.author = playlist.author;
    safeEmptyPlaylist.description = playlist.description;
    safeEmptyPlaylist.cover = playlist.cover;
    safeEmptyPlaylist.maps = playlist.maps.map((beatmap: IBeatmap) => {
      const copy = { ...beatmap };
      delete copy.dateAdded;
      return copy;
    });

    return crypto
      .createHash('sha1')
      .update(JSON.stringify(safeEmptyPlaylist) + filepath.toLowerCase())
      .digest('hex')
      .substr(0, 5);
  }

  public static async getHashFromPath(filepath: string): Promise<string | undefined> {
    try {
      const playlist = await this.load(filepath);
      return playlist.hash;
    } catch (e) {
      return undefined;
    }
  }

  private static async isOldFormat(buffer: Buffer) {
    return buffer.slice(0, magicNumber.length).toString() !== magicNumber.toString();
  }

  private static async checkFileExist(filepath: string) {
    if (!await fs.pathExists(filepath)) {
      throw FILE_NOT_FOUND;
    }
  }

  private static readLegacy(buffer: Buffer): IPlaylist {
    try {
      const legacyPlaylist = JSON.parse(buffer.toString());
      return convertLegacyPlaylist(legacyPlaylist);
    } catch (e) {
      throw INVALID_JSON_FORMAT;
    }
  }

  private static async readBlister(buffer: Buffer): Promise<IPlaylist> {
    try {
      return await deserialize(buffer);
    } catch (e) {
      throw INVALID_BLISTER_FORMAT;
    }
  }
}

export interface PlaylistBlisterLoaded {
  format: PlaylistFormatType,
  playlist: IPlaylist;
  hash: string;
  filepath: string;
}
