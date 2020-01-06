import { make } from 'vuex-pathify';

export interface AppStateStoreState {
  subNav: Object[],
}

const state = {
  subNav: [],
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
