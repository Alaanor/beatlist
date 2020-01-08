/* istanbul ignore file */
import store from '@/plugins/store';
import { BeatmapLocal } from '@/libraries/beatmap/BeatmapLocal';

export default class BeatmapLibrary {
  public static GetAllMaps(): BeatmapLocal[] {
    return store.getters['beatmap/beatmaps'] as BeatmapLocal[];
  }

  public static GetAllValidMap(): BeatmapLocal[] {
    return this.GetAllMaps()
      .filter((beatmap: BeatmapLocal) => beatmap.loadState.valid);
  }

  public static GetAllInvalidMap(): BeatmapLocal[] {
    return this.GetAllMaps()
      .filter((beatmap: BeatmapLocal) => !beatmap.loadState.valid);
  }

  public static GetLastScanDate(): Date {
    return store.getters['beatmap/lastScan'];
  }

  public static UpdateAllMaps(beatmaps: BeatmapLocal[]) {
    store.commit('beatmap/SET_LAST_SCAN', new Date());
    store.commit(
      'beatmap/SET_BEATMAPS',
      beatmaps.map((beatmap) => Object.freeze(beatmap)),
    );
  }

  public static ClearCache() {
    store.commit('beatmap/SET_LAST_SCAN', undefined);
    store.commit('beatmap/SET_BEATMAPS', []);
  }
}
