import PlaylistInstaller from '@/libraries/os/beatSaber/installer/PlaylistInstaller';
import { PlaylistLocal, PlaylistLocalMap } from '@/libraries/playlist/PlaylistLocal';
import PlaylistLoader from '@/libraries/playlist/loader/PlaylistLoader';
import PlaylistScanner from '@/libraries/scanner/playlist/PlaylistScanner';
import { BeatsaverBeatmap } from '@/libraries/net/beatsaver/BeatsaverBeatmap';

export default class PlaylistOperation {
  public static async CreateNewPlaylist(): Promise<PlaylistLocal> {
    return PlaylistInstaller.InstallNewEmpty();
  }

  public static async DeletePlaylist(playlist: PlaylistLocal): Promise<void> {
    return PlaylistInstaller.Uninstall(playlist);
  }

  public static async UpdatePlaylist(playlist: PlaylistLocal): Promise<PlaylistLocal | undefined> {
    if (!playlist.path) return undefined;

    await PlaylistLoader.Save(playlist);

    const scanner = new PlaylistScanner();
    return scanner.scanOne(playlist.path);
  }

  public static AddMapInPlaylist(playlist: PlaylistLocal, beatsaver: BeatsaverBeatmap)
    : Promise<PlaylistLocal | undefined> {
    const copy = { ...playlist };
    copy.maps = [...playlist.maps];

    this.PushMapInPlaylist(copy, beatsaver);

    return this.UpdatePlaylist(copy);
  }

  public static RemoveMapFromPlaylist(playlist: PlaylistLocal, beatsaver: BeatsaverBeatmap) {
    const copy = { ...playlist };

    copy.maps = playlist.maps
      .filter((entry: PlaylistLocalMap) => entry.online?.hash !== beatsaver.hash);

    return this.UpdatePlaylist(copy);
  }

  public static BulkAddMapInPlaylist(playlist: PlaylistLocal, beatsavers: BeatsaverBeatmap[]) {
    const copy = { ...playlist };
    copy.maps = [...playlist.maps];

    beatsavers.forEach((beatsaver: BeatsaverBeatmap) => {
      this.PushMapInPlaylist(copy, beatsaver);
    });

    return this.UpdatePlaylist(copy);
  }

  public static BulkRemoveMapFromPlaylist(playlist: PlaylistLocal, beatsavers: BeatsaverBeatmap[]) {
    const copy = { ...playlist };

    copy.maps = playlist.maps
      .filter((entry: PlaylistLocalMap) => beatsavers
        .find((beatsaver: BeatsaverBeatmap) => entry.online?.hash !== beatsaver.hash));

    return this.UpdatePlaylist(copy);
  }

  private static PushMapInPlaylist(playlist: PlaylistLocal, beatsaver: BeatsaverBeatmap) {
    const playlistLocalMap = {
      online: beatsaver,
      error: null,
      dateAdded: new Date(),
    } as PlaylistLocalMap;

    playlist.maps.push(playlistLocalMap);
  }
}
