import { BeatsaverBeatmap } from "@/libraries/net/beatsaver/BeatsaverBeatmap";
import { BeatmapLocal } from "@/libraries/beatmap/BeatmapLocal";

export interface BeatmapsTableDataUnit {
  local: BeatmapLocal | undefined;
  data: BeatsaverBeatmap;
}
