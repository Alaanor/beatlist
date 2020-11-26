/* istanbul ignore file */
import store from "@/plugins/store";
import { Beatmap } from "@/libraries/beatmap/Beatmap";
import { BeatsaverBeatmap } from "@/libraries/net/beatsaver/BeatsaverBeatmap";
import { BeatmapsTableDataUnit } from "@/components/beatmap/table/core/BeatmapsTableDataUnit";
import BeatsaverCachedLibrary from "@/libraries/beatmap/repo/BeatsaverCachedLibrary";
import PlaylistLibrary from "../playlist/PlaylistLibrary";
import { PlaylistLocal } from "../playlist/PlaylistLocal";

/**
 * Not sure what this is lol
 */

export default class BeatmapLibrary {
  public static GetAllMaps(): Beatmap[] {
    return store.getters["beatmap/beatmaps"] as Beatmap[];
  }

  public static GetAllValidMap(): Beatmap[] {
    return this.GetAllMaps().filter(
      (beatmap: Beatmap) => beatmap.loadState.valid
    );
  }

  public static GetAllInvalidMap(): Beatmap[] {
    return this.GetAllMaps().filter(
      (beatmap: Beatmap) => !beatmap.loadState.valid
    );
  }

  public static GetAllValidBeatmapAsTableData(): BeatmapsTableDataUnit[] {
    return this.GetAllMaps()
      .map((beatmap: Beatmap) => ({
        local: beatmap,
        data: beatmap.hash
          ? BeatsaverCachedLibrary.GetByHash(beatmap.hash)?.beatmap
          : undefined,
      }))
      .filter((unit) => unit.data !== undefined) as BeatmapsTableDataUnit[];
  }

  public static GetMapByHash(hash: string): Beatmap | undefined {
    return this.GetAllValidMap().find(
      (beatmap: Beatmap) => beatmap.hash === hash.toUpperCase()
    );
  }

  public static HasBeatmap(beatmap: BeatsaverBeatmap): boolean {
    return this.GetMapByHash(beatmap.hash) !== undefined;
  }

  public static GetLastScanDate(): Date {
    return store.getters["beatmap/lastScan"];
  }

  public static UpdateAllMaps(beatmaps: Beatmap[]) {
    store.commit("beatmap/SET_LAST_SCAN", new Date());
    store.commit("beatmap/SET_BEATMAPS", beatmaps);
  }

  public static ClearCache() {
    store.commit("beatmap/SET_LAST_SCAN", undefined);
    store.commit("beatmap/SET_BEATMAPS", []);
  }

  public static AddBeatmap(beatmap: Beatmap) {
    store.commit("beatmap/addBeatmap", { beatmap });
  }

  public static RemoveBeatmap(beatmap: Beatmap) {
    store.commit("beatmap/removeBeatmap", { beatmap });
  }

  public static GetPlaylists(beatmap: Beatmap): PlaylistLocal[] {
    return PlaylistLibrary.GetAllValidPlaylists().filter((playlist) =>
      playlist.maps.find(
        (map) => map.hash !== undefined && map.hash === beatmap.hash
      )
    );
  }
}
