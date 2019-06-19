import Vue from 'vue';
import Vuex from 'vuex';
import VuexPersistence from 'vuex-persist';

Vue.use(Vuex);

const vuexLocal = new VuexPersistence({
  storage: window.localStorage,
});

export default new Vuex.Store<any>({
  plugins: [vuexLocal.plugin],
  state: {
    installationPath: '',
    configValid: false,
  },
  mutations: {
    setInstallationPath(state, status) {
      state.installationPath = status;
    },
    setConfigValidState(state, status) {
      state.configValid = status || false;
    },
  },
});
