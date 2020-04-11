import { make } from 'vuex-pathify';
import { BeatmapLocal } from '@/libraries/beatmap/BeatmapLocal';
import { BeatsaverItem } from '@/libraries/beatmap/repo/BeatsaverItem';

export interface BeatmapStoreState {
  lastScan: Date,
  beatmaps: BeatmapLocal[],
  beatsaverCached: BeatsaverItem[],
}

const state = {
  lastScan: undefined,
  beatmaps: [],
  beatsaverCached: [],
};

const getters = {
  ...make.getters(state),
};

const mutations = {
  ...make.mutations(state),
  addBeatmap(context: BeatmapStoreState, payload: { beatmap: BeatmapLocal }) {
    context.beatmaps.push(payload.beatmap);
  },
  removeBeatmap(context: BeatmapStoreState, payload: { beatmap: BeatmapLocal }) {
    context.beatmaps = context.beatmaps
      .filter((value: BeatmapLocal) => value.hash !== payload.beatmap.hash);
  },
  addBeatsaberCached(context: BeatmapStoreState, payload: { beatsaverItem: BeatsaverItem }) {
    context.beatsaverCached.push(payload.beatsaverItem);
  },
  updateBeatsaberCached(context: BeatmapStoreState, payload: { beatsaverItem: BeatsaverItem }) {
    if (payload.beatsaverItem.beatmap === undefined) {
      return;
    }

    const index = context.beatsaverCached
      .findIndex((item) => item.beatmap?.hash === payload.beatsaverItem.beatmap?.hash);

    if (context.beatsaverCached[index].loadState.valid && !payload.beatsaverItem.loadState.valid) {
      return;
    }

    context.beatsaverCached[index] = payload.beatsaverItem;
  },
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
};
