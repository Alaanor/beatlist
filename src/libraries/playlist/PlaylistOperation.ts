import PlaylistInstaller from "@/libraries/os/beatSaber/installer/PlaylistInstaller";
import {
  PlaylistLocal,
  PlaylistLocalMap,
} from "@/libraries/playlist/PlaylistLocal";
import PlaylistLoader from "@/libraries/playlist/loader/PlaylistLoader";
import PlaylistScanner from "@/libraries/scanner/playlist/PlaylistScanner";

export default class PlaylistOperation {
  public static async CreateNewPlaylist(): Promise<PlaylistLocal> {
    return PlaylistInstaller.InstallNewEmpty();
  }

  public static async DeletePlaylist(playlist: PlaylistLocal): Promise<void> {
    return PlaylistInstaller.Uninstall(playlist);
  }

  public static async UpdatePlaylist(
    playlist: PlaylistLocal
  ): Promise<PlaylistLocal | undefined> {
    if (!playlist.path) return undefined;

    let updatedPlaylist = await PlaylistLoader.Save(playlist);
    const scanner = new PlaylistScanner();

    if (updatedPlaylist.path) {
      updatedPlaylist = await scanner.scanOne(updatedPlaylist.path);
    }

    return updatedPlaylist;
  }

  public static AddMapInPlaylist(
    playlist: PlaylistLocal,
    beatmapHash: string
  ): Promise<PlaylistLocal | undefined> {
    const copy = { ...playlist };
    copy.maps = [...playlist.maps];

    this.PushMapInPlaylist(copy, beatmapHash);

    return this.UpdatePlaylist(copy);
  }

  public static RemoveMapFromPlaylist(
    playlist: PlaylistLocal,
    beatmapHash: string
  ) {
    const copy = { ...playlist };

    copy.maps = playlist.maps.filter(
      (entry: PlaylistLocalMap) => entry.hash !== beatmapHash
    );

    return this.UpdatePlaylist(copy);
  }

  public static BulkAddMapInPlaylist(
    playlist: PlaylistLocal,
    beatmapHashes: string[]
  ) {
    const copy = { ...playlist };
    copy.maps = [...playlist.maps];

    beatmapHashes.forEach((hash: string) => {
      this.PushMapInPlaylist(copy, hash);
    });

    return this.UpdatePlaylist(copy);
  }

  public static BulkRemoveMapFromPlaylist(
    playlist: PlaylistLocal,
    beatmapHashes: string[]
  ) {
    const copy = { ...playlist };

    copy.maps = playlist.maps.filter(
      (entry: PlaylistLocalMap) =>
        !beatmapHashes.find((hash: string) => entry.hash === hash)
    );

    return this.UpdatePlaylist(copy);
  }

  private static PushMapInPlaylist(
    playlist: PlaylistLocal,
    beatmapHash: string
  ) {
    const playlistLocalMap = {
      hash: beatmapHash,
      dateAdded: new Date(),
    } as PlaylistLocalMap;

    playlist.maps.push(playlistLocalMap);
  }
}
