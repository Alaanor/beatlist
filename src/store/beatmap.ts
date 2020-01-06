import { make } from 'vuex-pathify';
import { BeatmapLocal } from '@/libraries/beatmap/BeatmapLocal';

export interface BeatmapStoreState {
  lastScan: Date,
  beatmaps: BeatmapLocal[],
}

const state = {
  lastScan: undefined,
  beatmaps: [],
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
