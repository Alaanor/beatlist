import Vue from 'vue';
import Vuex from 'vuex';
import VuexPersistence from 'vuex-persist';
import pathify from 'vuex-pathify';
import settings from '@/store/settings';

Vue.use(Vuex);

const vuexLocal = new VuexPersistence({
  storage: window.localStorage,
});

console.log(settings);
export default new Vuex.Store<any>({
  plugins: [
    vuexLocal.plugin,
    pathify.plugin,
  ],
  modules: {
    settings,
  },
  strict: true,
});
