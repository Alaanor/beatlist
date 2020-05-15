import { BeatmapLoadState } from "./BeatmapLoadState";

export interface BeatmapLocal {
  folderPath: string;
  coverPath: string;
  songPath: string;
  hash: string | undefined;
  loadState: BeatmapLoadState;
}

export function isBeatmapLocal(beatmap: any): beatmap is BeatmapLocal {
  return (
    "folderPath" in beatmap &&
    "coverPath" in beatmap &&
    "songPath" in beatmap &&
    "hash" in beatmap &&
    "loadState" in beatmap
  );
}
