import { make } from 'vuex-pathify';
import PlaylistFormatType from '@/libraries/playlist/PlaylistFormatType';

export interface SettingsStoreState {
  appVersion: string | undefined,
  installationPath: string,
  installationPathValid: boolean,
  darkTheme: boolean,
  enableDiscordRichPresence: boolean,
  defaultExportFormat: PlaylistFormatType,
  beatmapsTable: {
    localBeatmaps: BeatmapTableStoreState;
    beatsaverBeatmaps: BeatmapTableStoreState;
    playlistContent: BeatmapTableStoreState;
    playlistBrowser: BeatmapTableStoreState;
  }
}

export interface BeatmapTableStoreState {
  shownColumn: string[],
  itemsPerPage: number,
}

const defaultTableSettings = {
  shownColumn: ['cover', 'name', 'mapper', 'difficulties'],
  itemsPerPage: 10,
};

const state = {
  appVersion: undefined,
  installationPath: '',
  installationPathValid: false,
  darkTheme: true,
  enableDiscordRichPresence: true,
  defaultExportFormat: PlaylistFormatType.Json,
  beatmapsTable: {
    localBeatmaps: { ...defaultTableSettings },
    beatsaverBeatmaps: { ...defaultTableSettings },
    playlistContent: { ...defaultTableSettings },
    playlistBrowser: { ...defaultTableSettings },
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
