/* istanbul ignore file */
import store from "@/plugins/store";
import { BeatmapLocal } from "@/libraries/beatmap/BeatmapLocal";
import { BeatsaverBeatmap } from "@/libraries/net/beatsaver/BeatsaverBeatmap";
import { BeatmapsTableDataUnit } from "@/components/beatmap/table/core/BeatmapsTableDataUnit";
import BeatsaverCachedLibrary from "@/libraries/beatmap/repo/BeatsaverCachedLibrary";

export default class BeatmapLibrary {
  public static GetAllMaps(): BeatmapLocal[] {
    return store.getters["beatmap/beatmaps"] as BeatmapLocal[];
  }

  public static GetAllValidMap(): BeatmapLocal[] {
    return this.GetAllMaps().filter(
      (beatmap: BeatmapLocal) => beatmap.loadState.valid
    );
  }

  public static GetAllInvalidMap(): BeatmapLocal[] {
    return this.GetAllMaps().filter(
      (beatmap: BeatmapLocal) => !beatmap.loadState.valid
    );
  }

  public static GetAllValidBeatmapAsTableData(): BeatmapsTableDataUnit[] {
    return this.GetAllMaps()
      .map((beatmap: BeatmapLocal) => ({
        local: beatmap,
        data: beatmap.hash
          ? BeatsaverCachedLibrary.GetByHash(beatmap.hash)?.beatmap
          : undefined,
      }))
      .filter((unit) => unit.data !== undefined) as BeatmapsTableDataUnit[];
  }

  public static GetMapByHash(hash: string): BeatmapLocal | undefined {
    return this.GetAllValidMap().find(
      (beatmap: BeatmapLocal) => beatmap.hash === hash.toUpperCase()
    );
  }

  public static HasBeatmap(beatmap: BeatsaverBeatmap): boolean {
    return this.GetMapByHash(beatmap.hash) !== undefined;
  }

  public static GetLastScanDate(): Date {
    return store.getters["beatmap/lastScan"];
  }

  public static UpdateAllMaps(beatmaps: BeatmapLocal[]) {
    store.commit("beatmap/SET_LAST_SCAN", new Date());
    store.commit("beatmap/SET_BEATMAPS", beatmaps);
  }

  public static ClearCache() {
    store.commit("beatmap/SET_LAST_SCAN", undefined);
    store.commit("beatmap/SET_BEATMAPS", []);
  }

  public static AddBeatmap(beatmap: BeatmapLocal) {
    store.commit("beatmap/addBeatmap", { beatmap });
  }

  public static RemoveBeatmap(beatmap: BeatmapLocal) {
    store.commit("beatmap/removeBeatmap", { beatmap });
  }
}
