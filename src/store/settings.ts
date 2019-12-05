import { make } from 'vuex-pathify';

const state = {
  installationPath: '',
  installationPathValid: false,
  configValid: false,
  darkTheme: true,
  miniVariant: true,
  displayMode: 0,
  enableDiscordRichPresence: true,
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
