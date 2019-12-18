/* istanbul ignore file */
import store from 'src/plugins/store';
import { BeatmapLocal } from 'src/libraries/beatmap/BeatmapLocal';

export default class BeatmapLibrary {
  public static GetAllMaps(): BeatmapLocal[] {
    return store.getters['beatmap/beatmaps'] as BeatmapLocal[];
  }

  public static GetLastScan(): Date {
    return store.getters['beatmap/lastScan'];
  }

  public static UpdateAllMaps(beatmaps: BeatmapLocal[]) {
    store.commit('beatmap/SET_LAST_SCAN', new Date());
    store.commit('beatmap/SET_BEATMAPS', beatmaps);
  }

  public static ClearCache() {
    store.commit('beatmap/SET_LAST_SCAN', undefined);
    store.commit('beatmap/SET_BEATMAPS', []);
  }
}
