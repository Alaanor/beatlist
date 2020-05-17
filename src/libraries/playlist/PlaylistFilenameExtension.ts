import fs from "fs-extra";
import path from "path";
import PlaylistFormatType from "@/libraries/playlist/PlaylistFormatType";

export const PLAYLIST_EXTENSION_NAME_BPLIST = "bplist";
export const PLAYLIST_EXTENSION_NAME_JSON = "json";
export const PLAYLIST_EXTENSION_NAME_BLIST = "blist";
export const FILENAME_EXTENSION_UNHANDLED = new Error(
  "Unhandled filename extension"
);

export default class PlaylistFilenameExtension {
  static GetFor(format: PlaylistFormatType): string {
    switch (format) {
      case PlaylistFormatType.Json:
        return PLAYLIST_EXTENSION_NAME_JSON;
      case PlaylistFormatType.Blist:
        return PLAYLIST_EXTENSION_NAME_BLIST;
      default:
        throw FILENAME_EXTENSION_UNHANDLED;
    }
  }

  static async RenameTo(
    filepath: string,
    format: PlaylistFormatType
  ): Promise<string> {
    if (!(await fs.pathExists(filepath))) {
      throw new Error(`That path doesn't exist, can't rename: ${filepath}`);
    }

    if (!(await fs.stat(filepath)).isFile()) {
      throw new Error(`The path is not a file. (path: ${filepath})`);
    }

    const newFilepath = path.join(
      path.dirname(filepath),
      `${path.basename(
        filepath,
        path.extname(filepath)
      )}.${PlaylistFilenameExtension.GetFor(format)}`
    );

    if (await fs.pathExists(newFilepath)) {
      throw new Error(
        `The new path already exist, cancelled before the override. (path: ${newFilepath})`
      );
    }

    await fs.rename(filepath, newFilepath);

    return newFilepath;
  }

  public static isExtensionCorrect(
    filepath: string,
    format: PlaylistFormatType
  ) {
    return path.extname(filepath).substr(1) === this.GetFor(format);
  }

  public static detectType(filepath: string): PlaylistFormatType {
    const extName = path.extname(filepath).substr(1);

    switch (extName) {
      case PLAYLIST_EXTENSION_NAME_BPLIST:
      case PLAYLIST_EXTENSION_NAME_JSON:
        return PlaylistFormatType.Json;

      case PLAYLIST_EXTENSION_NAME_BLIST:
        return PlaylistFormatType.Blist;

      default:
        throw FILENAME_EXTENSION_UNHANDLED;
    }
  }

  public static isValid(filepath: string) {
    try {
      this.detectType(filepath);
      return true;
    } catch (e) {
      return false;
    }
  }
}
