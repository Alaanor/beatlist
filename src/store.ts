import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
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
