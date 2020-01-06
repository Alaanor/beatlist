import Vue from 'vue';
import Vuex from 'vuex';
import VuexPersistence from 'vuex-persist';
import pathify from 'vuex-pathify';
import localForage from 'localforage';
import modules, { StoreState } from '@/store';

Vue.use(Vuex);

const vuexLocalCachedData = new VuexPersistence<StoreState>({
  key: 'vuex-cached-data',
  storage: localForage,
  asyncStorage: true,
  strictMode: true,
  reducer: (state) => ({
    beatmap: state.beatmap,
    playlist: state.playlist,
  }),
});

const vuexLocalMain = new VuexPersistence<StoreState>({
  key: 'vuex-main',
  storage: localForage,
  asyncStorage: true,
  strictMode: true,
  reducer: (state) => ({
    settings: state.settings,
    notification: state.notification,
    appState: state.appState,
  }),
});

const store = new Vuex.Store<any>({
  plugins: [
    vuexLocalMain.plugin,
    vuexLocalCachedData.plugin,
    pathify.plugin,
  ],
  modules,
  mutations: {
    RESTORE_MUTATION: vuexLocalMain.RESTORE_MUTATION,
  },
  strict: true,
});

export default store;
