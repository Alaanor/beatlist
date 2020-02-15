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
        async (path: string) => PlaylistLoader.Load(path, false, progressGroup.getNewOne()),
      ),
    ));

    this.result.removedItems = diff.removed.length;
    this.result.keptItems = diff.kept.length;

    this.checkForChange(diff.kept);

    const allPlaylists = this.MergeWithExistingPlaylists(diff);
    PlaylistLibrary.UpdateAllPlaylist(allPlaylists);

    return this.result;
  }

  public async scanOne(path: string): Promise<PlaylistLocal> {
    const playlist = await PlaylistLoader.Load(path);
    PlaylistLibrary.AddPlaylist(playlist);
    this.result.newItems = [playlist];
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

  private checkForChange(paths: string[]) {
    paths.forEach(async (path: string) => {
      const fileHash = await PlaylistBlisterLoader.getHashFromPath(path);
      const libHash = PlaylistLibrary.GetFromPath(path)?.hash;
      if (fileHash !== libHash && fileHash !== undefined) {
        await PlaylistScanner.updatePlaylist(path);
        this.result.updatedItems += 1;
      }
    });
  }

  private static async updatePlaylist(path: string) {
    const oldPlaylist = PlaylistLibrary.GetFromPath(path);

    if (!oldPlaylist) {
      return;
    }

    const newPlaylist = await PlaylistLoader.update(oldPlaylist, path);
    PlaylistLibrary.RemovePlaylist(oldPlaylist);
    PlaylistLibrary.AddPlaylist(newPlaylist);
  }
}
