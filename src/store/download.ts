import { make } from 'vuex-pathify';
import DownloadResult from '@/libraries/net/downloader/result/DownloadResult';

export interface DownloadStoreState {
  history: DownloadResult[],
}

const state = {
  history: [],
};

const getters = {
  ...make.getters(state),
};

const mutations = {
  ...make.mutations(state),
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
};
