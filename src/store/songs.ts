import {make} from 'vuex-pathify';
import SongData from '@/lib/SongData';
import BeatSaber from '@/lib/BeatSaber';

const state = {
  lastScan: undefined,
  songs: undefined,
  playlists: [],
};

const mutations = {
  ...make.mutations(state),
};

// noinspection JSUnusedGlobalSymbols
const actions = {
  async loadPlaylists(context: any) {
    const instPath = context.rootState.settings.installationPath as string;
    const songs = context.state.songs as SongData[];
    const beatSaber = new BeatSaber(instPath);
    context.commit('SET_PLAYLISTS', await beatSaber.getPlaylists(songs));
  },
};

export default {
  namespaced: true,
  state,
  actions,
  mutations,
};
