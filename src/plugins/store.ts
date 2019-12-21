import Vue from 'vue';
import Vuex from 'vuex';
import VuexPersistence from 'vuex-persist';
import pathify from 'vuex-pathify';
import localForage from 'localforage';
import modules from '@/store';

Vue.use(Vuex);

const vuexLocal = new VuexPersistence<any>({
  storage: localForage,
  asyncStorage: true,
  strictMode: true,
});

const store = new Vuex.Store<any>({
  plugins: [
    vuexLocal.plugin,
    pathify.plugin,
  ],
  modules,
  mutations: {
    RESTORE_MUTATION: vuexLocal.RESTORE_MUTATION,
  },
  strict: true,
});

export default store;
