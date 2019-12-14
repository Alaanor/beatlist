import { make } from 'vuex-pathify';

const state = {
  installationPath: '',
  installationPathValid: false,
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
  configValid(currentState: any) {
    return currentState.installationPathValid;
  },
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
};
