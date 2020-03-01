import PlaylistInstaller from '@/libraries/os/beatSaber/installer/PlaylistInstaller';
import { PlaylistLocal } from '@/libraries/playlist/PlaylistLocal';
import PlaylistLoader from '@/libraries/playlist/loader/PlaylistLoader';
import PlaylistScanner from '@/libraries/scanner/playlist/PlaylistScanner';

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

  public static AddMapInPlaylist() {

  }

  public static RemoveMapFromPlaylist() {

  }
}
