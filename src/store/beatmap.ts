import { make } from "vuex-pathify";
import { BeatmapLocal } from "@/libraries/beatmap/BeatmapLocal";
import {
  BeatsaverItemInvalid,
  BeatsaverItemValid,
} from "@/libraries/beatmap/repo/BeatsaverItem";
import {
  BeatsaverKey,
  toStrKey,
} from "@/libraries/beatmap/repo/BeatsaverKeyType";

export interface BeatmapStoreState {
  lastScan: Date;
  beatmaps: BeatmapLocal[];
  beatsaverCached: Map<string, BeatsaverItemValid>;
  beatsaverFailCached: Map<string, BeatsaverItemInvalid>;
  beatsaverKeyToHashIndex: Map<string, string>;
}

const state = {
  lastScan: undefined,
  beatmaps: [],
  beatsaverCached: new Map<string, BeatsaverItemInvalid>(),
  beatsaverFailCached: new Map<string, BeatsaverItemInvalid>(),
  beatsaverKeyToHashIndex: new Map<string, string>(),
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
  setBeatsaverCached(
    context: BeatmapStoreState,
    payload: { hash: string; item: BeatsaverItemValid }
  ) {
    context.beatsaverCached.set(payload.hash.toUpperCase(), payload.item);
    context.beatsaverKeyToHashIndex.set(
      payload.item.beatmap.key.toUpperCase(),
      payload.item.beatmap.hash.toUpperCase()
    );
  },
  addBeatsaverCachedInvalid(
    context: BeatmapStoreState,
    payload: { key: BeatsaverKey; item: BeatsaverItemInvalid }
  ) {
    context.beatsaverFailCached.set(toStrKey(payload.key), payload.item);
  },
  clearBeatsaverCache(context: BeatmapStoreState) {
    context.beatsaverCached = new Map<string, BeatsaverItemValid>();
    context.beatsaverFailCached = new Map<string, BeatsaverItemInvalid>();
    context.beatsaverKeyToHashIndex = new Map<string, string>();
  },
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
};
