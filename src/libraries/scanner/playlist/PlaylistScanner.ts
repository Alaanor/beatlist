import BeatSaber from "@/libraries/os/beatSaber/BeatSaber";
import PlaylistLibrary from "@/libraries/playlist/PlaylistLibrary";
import { PlaylistLocal } from "@/libraries/playlist/PlaylistLocal";
import { computeDifference, Differences } from "@/libraries/common/Differences";
import PlaylistLoader from "@/libraries/playlist/loader/PlaylistLoader";
import ProgressGroup from "@/libraries/common/ProgressGroup";
import PlaylistScannerResult from "@/libraries/scanner/playlist/PlaylistScannerResult";
import { ScannerInterface } from "@/libraries/scanner/ScannerInterface";
import ScannerLocker from "@/libraries/scanner/ScannerLocker";

export default class PlaylistScanner
  implements ScannerInterface<PlaylistLocal> {
  public result: PlaylistScannerResult = new PlaylistScannerResult();

  public async scanAll(
    progressGroup: ProgressGroup = new ProgressGroup()
  ): Promise<PlaylistScannerResult> {
    return ScannerLocker.acquire(async () => {
      const diff = await PlaylistScanner.GetTheDifferenceInPath();

      this.result.newItems = await Promise.all(
        diff.added.map(async (path: string) =>
          PlaylistLoader.Load(path, progressGroup.getNewOne())
        )
      );

      this.result.removedItems = diff.removed.length;
      this.result.keptItems = diff.kept.length;

      await this.checkForChange(diff.kept, progressGroup);

      const allPlaylists = this.MergeWithExistingPlaylists(diff);
      PlaylistLibrary.UpdateAllPlaylist(allPlaylists);

      return this.result;
    });
  }

  public async scanOne(path: string): Promise<PlaylistLocal> {
    return ScannerLocker.acquire(async () => {
      const playlist = await PlaylistLoader.Load(path);
      const oldPlaylist =
        playlist.path && PlaylistLibrary.GetByPath(playlist.path);

      if (oldPlaylist) {
        // update
        PlaylistLibrary.RemovePlaylist(oldPlaylist);
        PlaylistLibrary.AddPlaylist(playlist);
        this.result.updatedItems += 1;
      } else {
        // add
        PlaylistLibrary.AddPlaylist(playlist);
        this.result.newItems = [playlist];
      }

      return playlist;
    });
  }

  private static async GetTheDifferenceInPath(): Promise<Differences<string>> {
    const currentPaths =
      (await BeatSaber.getAllPlaylistsPath())?.map((path: string) =>
        path.toLowerCase()
      ) ?? [];

    const oldPaths = PlaylistLibrary.GetAllPlaylists().map(
      (playlist: PlaylistLocal) => playlist.path?.toLowerCase() ?? ""
    );

    return computeDifference(oldPaths, currentPaths);
  }

  private MergeWithExistingPlaylists(
    diff: Differences<string>
  ): PlaylistLocal[] {
    const existingPlaylist = PlaylistLibrary.GetAllPlaylists().filter(
      (playlist: PlaylistLocal) =>
        diff.kept.find((path: string) => playlist.path === path)
    );

    return this.result.newItems.concat(existingPlaylist);
  }

  private async checkForChange(
    paths: string[],
    progress: ProgressGroup
  ): Promise<void[]> {
    return Promise.all(
      paths.map(async (path: string) => {
        const newPlaylist = await PlaylistLoader.Load(
          path,
          progress.getNewOne()
        );
        const fileHash = newPlaylist.hash;
        const libHash = PlaylistLibrary.GetByPath(path)?.hash;

        if (fileHash !== libHash || fileHash === undefined) {
          if (fileHash === undefined && libHash === undefined) {
            return; // we got nothing new, so that's not an update
          }

          const oldPlaylist = PlaylistLibrary.GetByPath(path);

          if (oldPlaylist) {
            PlaylistLibrary.ReplacePlaylist(oldPlaylist, newPlaylist);
          } else {
            PlaylistLibrary.AddPlaylist(newPlaylist);
          }

          this.result.updatedItems += 1;
        }
      })
    );
  }
}
