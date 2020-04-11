/* istanbul ignore file */
import store from '@/plugins/store';
import { BeatmapLocal } from '@/libraries/beatmap/BeatmapLocal';
import { BeatsaverBeatmap } from '@/libraries/net/beatsaver/BeatsaverBeatmap';
import { BeatsaverItem } from '@/libraries/beatmap/repo/BeatsaverItem';

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

  public static GetMapByHash(hash: string): BeatmapLocal | undefined {
    return this.GetAllValidMap().find((beatmap: BeatmapLocal) => beatmap.hash === hash);
  }

  public static HasBeatmap(beatmap: BeatsaverBeatmap): boolean {
    return this.GetMapByHash(beatmap.hash) !== undefined;
  }

  public static GetLastScanDate(): Date {
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

  public static AddBeatmap(beatmap: BeatmapLocal) {
    store.commit('beatmap/addBeatmap', { beatmap });
  }

  public static RemoveBeatmap(beatmap: BeatmapLocal) {
    store.commit('beatmap/removeBeatmap', { beatmap });
  }

  public static GetAllBeatsaverCached(): BeatsaverItem[] {
    return store.getters['beatmap/beatsaverCached'];
  }

  public static AddBeatsaverCachedMap(beatsaverItem: BeatsaverItem) {
    store.commit('beatmap/addBeatsaberCached', beatsaverItem);
  }

  public static UpdateBeatsaverCachedMap(beatsaverItem: BeatsaverItem) {
    store.commit('beatmap/updateBeatsaberCached', beatsaverItem);
  }
}
