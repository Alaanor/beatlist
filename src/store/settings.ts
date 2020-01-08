import { make } from 'vuex-pathify';

export interface SettingsStoreState {
  installationPath: string,
  installationPathValid: boolean,
  darkTheme: boolean,
  miniVariant: boolean,
  enableDiscordRichPresence: boolean,
  beatmapsTable: BeatmapTableStoreState;
}

export interface BeatmapTableStoreState {
  shownColumn: string[],
}

const state = {
  installationPath: '',
  installationPathValid: false,
  darkTheme: true,
  miniVariant: true,
  enableDiscordRichPresence: true,
  beatmapsTable: {
    shownColumn: ['cover', 'name', 'mapper', 'difficulties'],
  },
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
