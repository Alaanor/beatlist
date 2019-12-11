/* istanbul ignore file */
import Vue from 'vue';
import Vuex from 'vuex';
import VuexPersistence from 'vuex-persist';
import pathify from 'vuex-pathify';
import localForage from 'localforage';
import modules from '../store';

Vue.use(Vuex);

const vuexPersistEmitter = () => (store: any) => {
  store.subscribe((mutation: any) => {
    if (mutation.type === 'RESTORE_MUTATION') {
      store._vm.$root.$emit('storageReady');
    }
  });
};

const vuexLocal = new VuexPersistence({
  storage: localForage,
  asyncStorage: true,
  strictMode: true,
});

export default new Vuex.Store({
  plugins: [
    vuexLocal.plugin,
    pathify.plugin,
    vuexPersistEmitter(),
  ],
  modules,
  mutations: {
    RESTORE_MUTATION: vuexLocal.RESTORE_MUTATION,
  },
  strict: true,
});
