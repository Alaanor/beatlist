import path from "path";
import fs from "fs-extra";

export default class PlaylistFilename {
  public static isFilenameCorrect(
    playlistPath: string,
    playlistTitle: string
  ): boolean {
    const filename = path.basename(playlistPath).split(".")[0];
    const expectedFilename = PlaylistFilename.computeFilenameFor(playlistTitle);

    return filename === expectedFilename;
  }

  public static async renameToItsTitle(
    playlistPath: string,
    playlistTitle: string
  ): Promise<string> {
    const folderPath = path.dirname(playlistPath);
    const ext = path.extname(playlistPath);
    const filename = PlaylistFilename.computeFilenameFor(playlistTitle);

    const newPlaylistPath = path.join(folderPath, `${filename}${ext}`);
    await fs.rename(playlistPath, newPlaylistPath);

    return newPlaylistPath;
  }

  public static computeFilenameFor(title: string) {
    return title.replace(/[^a-zA-Z0-9]+/g, "_").toLowerCase();
  }
}
