import Vue from 'vue';
import Vuex from 'vuex';
import VuexPersistence from 'vuex-persist';
import pathify from 'vuex-pathify';
import localForage from 'localforage';

import settings from '@/store/settings';
import songs from '@/store/songs';

Vue.use(Vuex);

const vuexLocal = new VuexPersistence({
  storage: localForage,
  asyncStorage: true,
});

export default new Vuex.Store<any>({
  plugins: [
    vuexLocal.plugin,
    pathify.plugin,
  ],
  modules: {
    settings,
    songs,
  },
  strict: true,
});
