import Vue from 'vue';
import Vuex from 'vuex';
import VuexPersistence from 'vuex-persist';
import localForage from 'localforage';
import pathify from '@/plugins/pathify';
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
    modal: state.modal,
  }),
});

const store = new Vuex.Store<StoreState>({
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
