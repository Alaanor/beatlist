import { make } from 'vuex-pathify';

export interface SettingsStoreState {
  installationPath: string,
  installationPathValid: boolean,
  darkTheme: boolean,
  miniVariant: boolean,
  enableDiscordRichPresence: boolean,
}

const state = {
  installationPath: '',
  installationPathValid: false,
  darkTheme: true,
  miniVariant: true,
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
