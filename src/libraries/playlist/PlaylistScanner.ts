import BeatSaber from '@/libraries/os/beatSaber/BeatSaber';
import PlaylistLibrary from '@/libraries/playlist/PlaylistLibrary';
import { PlaylistLocal } from '@/libraries/playlist/PlaylistLocal';
import { computeDifference, Differences } from '@/libraries/common/Differences';
import PlaylistLoader from '@/libraries/playlist/PlaylistLoader';
import ProgressGroup from '@/libraries/common/ProgressGroup';

export default class PlaylistScanner {
  public newPlaylists: PlaylistLocal[] = [];

  public removedPlaylists: number = 0;

  public keptPlaylists: number = 0;

  public async ScanAll(progressGroup: ProgressGroup = new ProgressGroup()) {
    const diff = await PlaylistScanner.GetTheDifferenceInPath();

    this.newPlaylists = (await Promise.all(
      diff.added.map(async (path: string) => {
        const p = await PlaylistLoader.Load(path, false, progressGroup.getNewOne());
        return p;
      }),
    ));

    this.removedPlaylists = diff.removed.length;
    this.keptPlaylists = diff.kept.length;

    const allPlaylists = this.MergeWithExistingPlaylists(diff);
    PlaylistLibrary.UpdateAllPlaylist(allPlaylists);
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

    return this.newPlaylists.concat(existingPlaylist);
  }
}
