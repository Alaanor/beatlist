import {make} from 'vuex-pathify';

const state = {
  installationPath: '',
  installationPathValid: false,
  configValid: false,
  darkTheme: true,
  miniVariant: false,
  permanent: false,
  displayMode: 0,
  pagination: {
    rowsPerPage: 6,
  },
};

const mutations = {
  ...make.mutations(state),
};


export default {
  namespaced: true,
  state,
  mutations,
};
