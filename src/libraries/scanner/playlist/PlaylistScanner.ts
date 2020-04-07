import BeatSaber from '@/libraries/os/beatSaber/BeatSaber';
import PlaylistLibrary from '@/libraries/playlist/PlaylistLibrary';
import { PlaylistLocal } from '@/libraries/playlist/PlaylistLocal';
import { computeDifference, Differences } from '@/libraries/common/Differences';
import PlaylistLoader from '@/libraries/playlist/loader/PlaylistLoader';
import ProgressGroup from '@/libraries/common/ProgressGroup';
import PlaylistScannerResult from '@/libraries/scanner/playlist/PlaylistScannerResult';
import { ScannerInterface } from '@/libraries/scanner/ScannerInterface';
import PlaylistBlisterLoader from '@/libraries/playlist/loader/PlaylistBlisterLoader';

export default class PlaylistScanner implements ScannerInterface<PlaylistLocal> {
  public result: PlaylistScannerResult = new PlaylistScannerResult();

  public async scanAll(progressGroup: ProgressGroup = new ProgressGroup())
    : Promise<PlaylistScannerResult> {
    const diff = await PlaylistScanner.GetTheDifferenceInPath();

    this.result.newItems = (await Promise.all(
      diff.added.map(
        async (path: string) => PlaylistLoader.Load(path, progressGroup.getNewOne()),
      ),
    ));

    this.result.removedItems = diff.removed.length;
    this.result.keptItems = diff.kept.length;

    await this.checkForChange(diff.kept);

    const allPlaylists = this.MergeWithExistingPlaylists(diff);
    PlaylistLibrary.UpdateAllPlaylist(allPlaylists);

    return this.result;
  }

  public async scanOne(path: string): Promise<PlaylistLocal> {
    const playlist = await PlaylistLoader.Load(path);
    const oldPlaylist = playlist.path && PlaylistLibrary.GetByPath(playlist.path);

    if (oldPlaylist) { // update
      PlaylistLibrary.RemovePlaylist(oldPlaylist);
      PlaylistLibrary.AddPlaylist(playlist);
      this.result.updatedItems += 1;
    } else { // add
      PlaylistLibrary.AddPlaylist(playlist);
      this.result.newItems = [playlist];
    }

    return playlist;
  }

  private static async GetTheDifferenceInPath() : Promise<Differences<string>> {
    const currentPaths = (await BeatSaber.getAllPlaylistsPath())
      ?.map((path: string) => path.toLowerCase()) ?? [];

    const oldPaths = PlaylistLibrary.GetAllPlaylists()
      .map((playlist: PlaylistLocal) => playlist.path?.toLowerCase() ?? '');

    return computeDifference(oldPaths, currentPaths);
  }

  private MergeWithExistingPlaylists(diff: Differences<string>): PlaylistLocal[] {
    const existingPlaylist = PlaylistLibrary.GetAllPlaylists().filter(
      (playlist: PlaylistLocal) => diff.kept.find((path: string) => playlist.path === path),
    );

    return this.result.newItems.concat(existingPlaylist);
  }

  private async checkForChange(paths: string[]): Promise<void[]> {
    return Promise.all(paths.map(async (path: string) => {
      const fileHash = await PlaylistBlisterLoader.getHashFromPath(path);
      const libHash = PlaylistLibrary.GetByPath(path)?.hash;

      if (fileHash !== libHash || fileHash === undefined) {
        const { updated } = await PlaylistScanner.updatePlaylist(path);
        this.result.updatedItems += updated ? 1 : 0;
      }
    }));
  }

  private static async updatePlaylist(path: string): Promise<{ updated: boolean }> {
    const oldPlaylist = PlaylistLibrary.GetByPath(path);

    if (!oldPlaylist) {
      return { updated: false };
    }

    const newPlaylist = await PlaylistLoader.update(oldPlaylist, path);

    if (newPlaylist.hash === oldPlaylist.hash) {
      return { updated: false };
    }

    PlaylistLibrary.RemovePlaylist(oldPlaylist);
    PlaylistLibrary.AddPlaylist(newPlaylist);

    return { updated: true };
  }
}
