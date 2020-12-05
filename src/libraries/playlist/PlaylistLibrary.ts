import store from "@/plugins/store";
import { PlaylistLocal } from "@/libraries/playlist/PlaylistLocal";

export default class PlaylistLibrary {
  public static GetAllPlaylists(): PlaylistLocal[] {
    return store.getters["playlist/playlists"] ?? [];
  }

  public static GetAllValidPlaylists(): PlaylistLocal[] {
    return this.GetAllPlaylists().filter(
      (playlist: PlaylistLocal) => playlist.loadState.valid
    );
  }

  public static GetAllInvalidPlaylists(): PlaylistLocal[] {
    return this.GetAllPlaylists().filter(
      (playlist: PlaylistLocal) => !playlist.loadState.valid
    );
  }

  public static GetLastScan(): Date {
    return store.getters["playlist/lastScan"];
  }

  public static GetByHash(hash: string): PlaylistLocal | undefined {
    return this.GetAllPlaylists().find(
      (playlist: PlaylistLocal) => playlist.hash === hash
    );
  }

  public static GetByPath(path: string): PlaylistLocal | undefined {
    return this.GetAllPlaylists().find(
      (playlist: PlaylistLocal) => playlist.path === path
    );
  }

  public static UpdateAllPlaylist(playlists: PlaylistLocal[]) {
    playlists = playlists.map((playlist) => {
      const copy = { ...playlist };
      copy.cover = null;
      return copy;
    });
    store.commit("playlist/SET_LAST_SCAN", new Date());
    store.commit("playlist/SET_PLAYLISTS", playlists);
  }

  public static ClearCache() {
    store.commit("playlist/SET_LAST_SCAN", undefined);
    store.commit("playlist/SET_PLAYLISTS", []);
  }

  public static AddPlaylist(playlist: PlaylistLocal) {
    store.commit("playlist/addPlaylist", { playlist });
  }

  public static RemovePlaylist(playlist: PlaylistLocal) {
    store.commit("playlist/removePlaylist", { playlist });
  }

  public static ReplacePlaylist(from: PlaylistLocal, to: PlaylistLocal) {
    store.commit("playlist/replacePlaylist", { from, to });
  }
}
