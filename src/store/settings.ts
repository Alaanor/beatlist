import { make } from 'vuex-pathify';

const state = {
  installationPath: '',
  configValid: false,
  darkTheme: true,
  miniVariant: false,
  permanent: false,
};

const mutations = {
  ...make.mutations(state),
};


export default {
  namespaced: true,
  state,
  mutations,
};
