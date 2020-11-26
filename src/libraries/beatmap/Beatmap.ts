import { BeatmapLoadState } from "./BeatmapLoadState";

/**
 * Beatmap information
 */

export interface Beatmap {
  folderPath: string;
  coverPath: string;
  songPath: string;
  hash: string | undefined;
  loadState: BeatmapLoadState;
}

export function isBeatmapLocal(beatmap: any): beatmap is Beatmap {
  return (
    "folderPath" in beatmap &&
    "coverPath" in beatmap &&
    "songPath" in beatmap &&
    "hash" in beatmap &&
    "loadState" in beatmap
  );
}
