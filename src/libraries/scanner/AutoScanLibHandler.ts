import chokidar from "chokidar";
import BeatSaber from "@/libraries/os/beatSaber/BeatSaber";
import store from "@/plugins/store";
import ScannerService from "@/libraries/scanner/ScannerService";

export default class AutoScanLibHandler {
  public static async register(): Promise<void> {
    // @ts-ignore
    await store.restored;

    const beatmapFolder = BeatSaber.getBeatmapFolder();
    const playlistFolder = BeatSaber.getPlaylistFolder();

    const watcher = chokidar.watch([beatmapFolder, playlistFolder], {
      ignoreInitial: true,
    });

    watcher.on("add", AutoScanLibHandler.onChange);
    watcher.on("change", AutoScanLibHandler.onChange);
    watcher.on("unlink", AutoScanLibHandler.onChange);
    watcher.on("addDir", AutoScanLibHandler.onChange);
    watcher.on("unlinkDir", AutoScanLibHandler.onChange);
  }

  private static onChange() {
    ScannerService.ScanAll().then();
  }
}
