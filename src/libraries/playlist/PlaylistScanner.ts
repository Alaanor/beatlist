import BeatSaber from '@/libraries/os/beatSaber/BeatSaber';
import PlaylistLibrary from '@/libraries/playlist/PlaylistLibrary';
import { PlaylistLocal } from '@/libraries/playlist/PlaylistLocal';
import { computeDifference, Differences } from '@/libraries/common/Differences';
import PlaylistLoader from '@/libraries/playlist/PlaylistLoader';

export default class PlaylistScanner {
  public newPlaylists: PlaylistLocal[] = [];

  public removedPlaylists: number = 0;

  public keptPlaylists: number = 0;

  public async ScanAll() {
    const diff = await PlaylistScanner.GetTheDifferenceInPath();

    this.newPlaylists = (await Promise.all(
      diff.added.map((path: string) => PlaylistLoader.Load(path)),
    )).filter((playlist: PlaylistLocal | undefined) => playlist !== undefined) as PlaylistLocal[];

    this.removedPlaylists = diff.removed.length;
    this.keptPlaylists = diff.kept.length;

    const allPlaylists = this.ReassembleAllPlaylist(diff);
    PlaylistLibrary.UpdateAllPlaylist(allPlaylists);
  }

  private static async GetTheDifferenceInPath() : Promise<Differences<string>> {
    const currentPaths = (await BeatSaber.getAllPlaylistsPath())
      ?.map((path: string) => path.toLowerCase()) ?? [];

    const oldPaths = PlaylistLibrary.GetAllPlaylists()
      .map((playlist: PlaylistLocal) => playlist.path.toLowerCase());

    return computeDifference(oldPaths, currentPaths);
  }

  private ReassembleAllPlaylist(diff: Differences<string>): PlaylistLocal[] {
    const existingPlaylist = PlaylistLibrary.GetAllPlaylists().filter(
      (beatmap: PlaylistLocal) => diff.kept.find(
        (path: string) => beatmap.path === path,
      ),
    );

    return this.newPlaylists.concat(existingPlaylist);
  }
}
