import BeatSaber from '@/libraries/os/beatSaber/BeatSaber';
import PlaylistLibrary from '@/libraries/playlist/PlaylistLibrary';
import { PlaylistLocal } from '@/libraries/playlist/PlaylistLocal';
import { computeDifference, Differences } from '@/libraries/common/Differences';
import PlaylistLoader from '@/libraries/playlist/PlaylistLoader';
import ProgressGroup from '@/libraries/common/ProgressGroup';
import { ScannerInterface } from '@/libraries/scanner/ScannerService';
import PlaylistScannerResult from '@/libraries/scanner/playlist/PlaylistScannerResult';

export default class PlaylistScanner implements ScannerInterface<PlaylistLocal> {
  public result: PlaylistScannerResult = new PlaylistScannerResult();

  public async scanAll(progressGroup: ProgressGroup = new ProgressGroup()) {
    const diff = await PlaylistScanner.GetTheDifferenceInPath();

    this.result.newItems = (await Promise.all(
      diff.added.map(
        async (path: string) => PlaylistLoader.Load(path, false, progressGroup.getNewOne()),
      ),
    ));

    this.result.removedItems = diff.removed.length;
    this.result.keptItems = diff.kept.length;

    const allPlaylists = this.MergeWithExistingPlaylists(diff);
    PlaylistLibrary.UpdateAllPlaylist(allPlaylists);
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
      .map((playlist: PlaylistLocal) => playlist.path.toLowerCase());

    return computeDifference(oldPaths, currentPaths);
  }

  private MergeWithExistingPlaylists(diff: Differences<string>): PlaylistLocal[] {
    const existingPlaylist = PlaylistLibrary.GetAllPlaylists().filter(
      (playlist: PlaylistLocal) => diff.kept.find((path: string) => playlist.path === path),
    );

    return this.result.newItems.concat(existingPlaylist);
  }
}
