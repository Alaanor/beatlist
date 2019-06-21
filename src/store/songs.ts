import { make } from 'vuex-pathify';

const state = {
  lastScan: undefined,
  songs: undefined,
};

const mutations = {
  ...make.mutations(state),
};


export default {
  namespaced: true,
  state,
  mutations,
};
