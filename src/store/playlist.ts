import { make } from "vuex-pathify";
import { PlaylistLocal } from "@/libraries/playlist/PlaylistLocal";

export interface PlaylistStoreState {
  lastScan: Date;
  playlists: PlaylistLocal[];
}

const state = {
  lastScan: undefined,
  playlists: [],
};

const getters = {
  ...make.getters(state),
};

const mutations = {
  ...make.mutations(state),
  addPlaylist(
    context: PlaylistStoreState,
    payload: { playlist: PlaylistLocal }
  ) {
    context.playlists.push(payload.playlist);
  },
  removePlaylist(
    context: PlaylistStoreState,
    payload: { playlist: PlaylistLocal }
  ) {
    context.playlists = context.playlists.filter(
      (value: PlaylistLocal) => value.hash !== payload.playlist.hash
    );
  },
  replacePlaylist(
    context: PlaylistStoreState,
    payload: { from: PlaylistLocal; to: PlaylistLocal }
  ) {
    const index = context.playlists.findIndex(
      (item) => item.path === payload.from.path
    );
    context.playlists[index] = payload.to;
  },
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
};
