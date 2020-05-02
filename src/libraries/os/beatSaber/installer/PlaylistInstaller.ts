import fs from "fs-extra";
import path from "path";
import {
  PlaylistBase,
  PlaylistLocal,
} from "@/libraries/playlist/PlaylistLocal";
import PlaylistLibrary from "@/libraries/playlist/PlaylistLibrary";
import PlaylistLoader from "@/libraries/playlist/loader/PlaylistLoader";
import BeatSaber from "@/libraries/os/beatSaber/BeatSaber";
import PlaylistScanner from "@/libraries/scanner/playlist/PlaylistScanner";
import PlaylistFormatType from "@/libraries/playlist/PlaylistFormatType";
import store from "@/plugins/store";
import PlaylistFilenameExtension from "@/libraries/playlist/PlaylistFilenameExtension";

declare const __static: string;
const defaultCoverPath = path.join(__static, "defaultCover.jpg");

export default class PlaylistInstaller {
  public static Install() {
    // TODO when online playlist
  }

  public static async InstallNewEmpty(): Promise<PlaylistLocal> {
    const randNum = Math.floor(Math.random() * 1e6 - 1) + 1e5;
    const name = `new-playlist-${randNum}`;
    const cover = Buffer.from(await fs.readFile(defaultCoverPath));
    const format = store.getters[
      "settings/defaultExportFormat"
    ] as PlaylistFormatType;
    const extension = PlaylistFilenameExtension.GetFor(format);
    const filepath = path
      .join(await BeatSaber.getPlaylistFolder(), `${name}.${extension}`)
      .toLowerCase();

    const emptyPlaylist = {
      title: name,
      author: "",
      description: "",
      cover,
      maps: [],
    } as PlaylistBase;

    await PlaylistLoader.SaveAt(filepath, emptyPlaylist, format);
    return new PlaylistScanner().scanOne(filepath);
  }

  public static async Uninstall(playlist: PlaylistLocal): Promise<void> {
    if (playlist.path) {
      await fs.unlink(playlist.path);
    }

    PlaylistLibrary.RemovePlaylist(playlist);
  }
}
