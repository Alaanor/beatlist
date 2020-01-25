import { make } from 'vuex-pathify';

export interface SettingsStoreState {
  installationPath: string,
  installationPathValid: boolean,
  darkTheme: boolean,
  enableDiscordRichPresence: boolean,
  beatmapsTable: BeatmapTableStoreState;
}

export interface BeatmapTableStoreState {
  shownColumn: string[],
  itemsPerPage: number,
}

const state = {
  installationPath: '',
  installationPathValid: false,
  darkTheme: true,
  enableDiscordRichPresence: true,
  beatmapsTable: {
    shownColumn: ['cover', 'name', 'mapper', 'difficulties'],
    itemsPerPage: 10,
  },
};

const mutations = {
  ...make.mutations(state),
};

const getters = {
  ...make.getters(state),
  configValid(currentState: SettingsStoreState) {
    return currentState.installationPathValid;
  },
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
};
