import store from '../../plugins/store';
import { BeatmapLocal } from './BeatmapLocal';

export default class BeatmapLibrary {
  /* istanbul ignore next */
  public static GetAllMaps(): BeatmapLocal[] {
    return store.getters['beatmap/beatmaps'] as BeatmapLocal[];
  }

  /* istanbul ignore next */
  public static UpdateAllMaps(beatmaps: BeatmapLocal[]) {
    store.commit('beatmap/SET_BEATMAPS', beatmaps);
  }
}
