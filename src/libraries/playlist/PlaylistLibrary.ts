import store from '@/plugins/store';
import { PlaylistLocal } from '@/libraries/playlist/PlaylistLocal';

export default class PlaylistLibrary {
  public static GetAllPlaylists(): PlaylistLocal[] {
    return store.getters['playlist/playlists'] ?? [];
  }

  public static GetAllValidPlaylists(): PlaylistLocal[] {
    return this.GetAllPlaylists()
      .filter((playlist: PlaylistLocal) => playlist.loadState.valid);
  }

  public static GetAllInvalidPlaylists(): PlaylistLocal[] {
    return this.GetAllPlaylists()
      .filter((playlist: PlaylistLocal) => !playlist.loadState.valid);
  }

  public static GetLastScan(): Date {
    return store.getters['playlist/lastScan'];
  }

  public static UpdateAllPlaylist(playlists: PlaylistLocal[]) {
    store.commit('playlist/SET_LAST_SCAN', new Date());
    store.commit('playlist/SET_PLAYLISTS', playlists);
  }

  public static ClearCache() {
    store.commit('playlist/SET_LAST_SCAN', undefined);
    store.commit('playlist/SET_PLAYLISTS', []);
  }
}
