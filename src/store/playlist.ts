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
    const copy = { ...payload.playlist };
    copy.cover = null;
    context.playlists.push(copy);
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

    const copyTo = { ...payload.to };
    copyTo.cover = null;
    context.playlists[index] = copyTo;
  },
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
};
