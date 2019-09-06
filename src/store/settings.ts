import {make} from 'vuex-pathify';

const state = {
  installationPath: '',
  installationPathValid: false,
  configValid: false,
  darkTheme: true,
  miniVariant: true,
  permanent: true,
  displayMode: 0,
};

const mutations = {
  ...make.mutations(state),
};

const getters = {
  ...make.getters(state),
};


export default {
  namespaced: true,
  state,
  getters,
  mutations,
};
