import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    installationPath: '',
  },
  mutations: {
    setInstallationPath(state, status) {
      state.installationPath = status;
    },
  },
});
