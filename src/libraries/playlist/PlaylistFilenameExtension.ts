import fs from 'fs-extra';
import path from 'path';
import PlaylistFormatType from '@/libraries/playlist/PlaylistFormatType';

export const PLAYLIST_EXTENSION_NAME_JSON = 'json';
export const PLAYLIST_EXTENSION_NAME_BLISTER = 'blist';

export default class PlaylistFilenameExtension {
  static GetFor(format: PlaylistFormatType): string {
    switch (format) {
      case PlaylistFormatType.Json:
        return PLAYLIST_EXTENSION_NAME_JSON;
      case PlaylistFormatType.Blister:
        return PLAYLIST_EXTENSION_NAME_BLISTER;
      default:
        throw new Error('Undefined playlist format');
    }
  }

  static async RenameTo(filepath: string, format: PlaylistFormatType) {
    if (!(await fs.pathExists(filepath))) {
      throw new Error(`That path doesn't exist, can't rename: ${filepath}`);
    }

    if (!(await fs.stat(filepath)).isFile()) {
      throw new Error(`The path is not a file. (path: ${filepath})`);
    }

    const newFilepath = path.join(
      path.dirname(filepath),
      `${path.basename(filepath, path.extname(filepath))}.${PlaylistFilenameExtension.GetFor(format)}`,
    );

    if (await fs.pathExists(newFilepath)) {
      throw new Error(`The new path already exist, cancelled before the override. (path: ${path})`);
    }

    await fs.rename(filepath, newFilepath);
  }

  public static isExtensionCorrect(filepath: string, format: PlaylistFormatType) {
    return path.extname(filepath) === this.GetFor(format);
  }
}
