/* istanbul ignore file */
import store from '@/plugins/store';
import { BeatmapLocal } from '@/libraries/beatmap/BeatmapLocal';
import { BeatsaverBeatmap } from '@/libraries/net/beatsaver/BeatsaverBeatmap';

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

  public static GetMapByKey(key: string): BeatmapLocal | undefined {
    return this.GetAllValidMap()
      .find((beatmap: BeatmapLocal) => beatmap.onlineData.key === key);
  }

  public static HasBeatmap(beatmap: BeatsaverBeatmap): boolean {
    return this.GetMapByKey(beatmap.key) !== undefined;
  }

  public static GetLastScanDate(): Date {
    return store.getters['beatmap/lastScan'];
  }

  public static UpdateAllMaps(beatmaps: BeatmapLocal[]) {
    store.commit('beatmap/SET_LAST_SCAN', new Date());
    store.commit('beatmap/SET_BEATMAPS', beatmaps);
  }

  public static UpdateMapOnlineData(onlineData: BeatsaverBeatmap) {
    store.commit('beatmap/updateOnlineDataFor', { onlineData });
  }

  public static ClearCache() {
    store.commit('beatmap/SET_LAST_SCAN', undefined);
    store.commit('beatmap/SET_BEATMAPS', []);
  }

  public static AddBeatmap(beatmap: BeatmapLocal) {
    store.commit('beatmap/addBeatmap', { beatmap });
  }

  public static RemoveBeatmap(beatmap: BeatmapLocal) {
    store.commit('beatmap/removeBeatmap', { beatmap });
  }
}
