import { make } from "vuex-pathify";
import { BeatmapLocal } from "@/libraries/beatmap/BeatmapLocal";
import { BeatsaverItem } from "@/libraries/beatmap/repo/BeatsaverItem";
import {
  BeatsaverKey,
  toStrKey,
} from "@/libraries/beatmap/repo/BeatsaverKeyType";

export interface BeatmapStoreState {
  lastScan: Date;
  beatmaps: BeatmapLocal[];
  beatsaverCached: Map<string, BeatsaverItem>;
}

const state = {
  lastScan: undefined,
  beatmaps: [],
  beatsaverCached: new Map<string, BeatsaverItem>(),
};

const getters = {
  ...make.getters(state),
};

const mutations = {
  ...make.mutations(state),
  addBeatmap(context: BeatmapStoreState, payload: { beatmap: BeatmapLocal }) {
    context.beatmaps.push(payload.beatmap);
  },
  removeBeatmap(
    context: BeatmapStoreState,
    payload: { beatmap: BeatmapLocal }
  ) {
    context.beatmaps = context.beatmaps.filter(
      (value: BeatmapLocal) => value.hash !== payload.beatmap.hash
    );
  },
  addBeatsaberCached(
    context: BeatmapStoreState,
    payload: { key: BeatsaverKey; item: BeatsaverItem }
  ) {
    context.beatsaverCached.set(toStrKey(payload.key), payload.item);
  },
  updateBeatsaberCached(
    context: BeatmapStoreState,
    payload: { key: BeatsaverKey; item: BeatsaverItem }
  ) {
    const cached = context.beatsaverCached.get(toStrKey(payload.key));

    if (cached && cached.loadState.valid && !payload.item.loadState.valid) {
      return;
    }

    context.beatsaverCached.set(toStrKey(payload.key), payload.item);
  },
  clearBeatsaverCache(context: BeatmapStoreState) {
    context.beatsaverCached = new Map<string, BeatsaverItem>();
  },
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
};
