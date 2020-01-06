import { make } from 'vuex-pathify';
import { PlaylistLocal } from '@/libraries/playlist/PlaylistLocal';

export interface PlaylistStoreState {
  lastScan: Date,
  playlists: PlaylistLocal[],
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
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
};
