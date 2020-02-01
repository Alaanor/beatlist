import { make } from 'vuex-pathify';
import { BeatmapLocal } from '@/libraries/beatmap/BeatmapLocal';
import { BeatsaverBeatmap } from '@/libraries/net/beatsaver/BeatsaverBeatmap';

export interface BeatmapStoreState {
  lastScan: Date,
  beatmaps: BeatmapLocal[],
}

const state = {
  lastScan: undefined,
  beatmaps: [],
};

const getters = {
  ...make.getters(state),
};

const mutations = {
  ...make.mutations(state),
  updateOnlineDataFor(context: BeatmapStoreState, payload: { onlineData: BeatsaverBeatmap }) {
    const localBeatmap = context.beatmaps
      ?.find((beatmap: BeatmapLocal) => beatmap.onlineData.key === payload.onlineData.key);

    if (localBeatmap) {
      localBeatmap.onlineData = payload.onlineData;
    }
  },
  addBeatmap(context: BeatmapStoreState, payload: { beatmap: BeatmapLocal }) {
    context.beatmaps.push(payload.beatmap);
  },
  removeBeatmap(context: BeatmapStoreState, payload: { beatmap: BeatmapLocal }) {
    context.beatmaps = context.beatmaps
      .filter((value: BeatmapLocal) => value.onlineData?.key !== payload.beatmap.onlineData.key);
  },
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
};
