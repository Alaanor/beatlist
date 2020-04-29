import { make } from 'vuex-pathify';

export interface ModalStoreState {
  newUserModal: boolean,
  newVersionModal: boolean,
}

const state = {
  newUserModal: false,
  newVersionModal: false,
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
