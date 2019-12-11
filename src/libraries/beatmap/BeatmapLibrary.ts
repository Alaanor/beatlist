import store from '../../plugins/store';
import { BeatmapLocal } from './BeatmapLocal';

export default class BeatmapLibrary {
  public static GetAllMaps(): BeatmapLocal[] {
    return store.getters['beatmap/beatmaps'] as BeatmapLocal[];
  }

  public static UpdateAllMaps(beatmaps: BeatmapLocal[]) {
    store.commit('beatmap/SET_BEATMAPS', beatmaps);
  }
}
