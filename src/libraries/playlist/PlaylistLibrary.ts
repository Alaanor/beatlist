import store from '@/plugins/store';
import { PlaylistLocal } from '@/libraries/playlist/PlaylistLocal';

export default class PlaylistLibrary {
  public static GetAllPlaylists(): PlaylistLocal[] {
    return store.getters['playlist/playlists'];
  }

  public static GetLastScan(): Date {
    return store.getters['playlist/lastScan'];
  }

  public static UpdateAllPlaylist(playlists: PlaylistLocal[]) {
    store.commit('playlist/SET_LAST_SCAN', new Date());
    store.commit(
      'playlist/SET_PLAYLISTS',
      playlists
        .map((playlist) => playlist.maps
          ?.map((beatmap) => Object.freeze(beatmap))),
    );
  }

  public static ClearCache() {
    store.commit('playlist/SET_LAST_SCAN', undefined);
    store.commit('playlist/SET_PLAYLISTS', []);
  }
}
