import { BeatsaverBeatmap } from "@/libraries/net/beatsaver/BeatsaverBeatmap";
import { Beatmap } from "@/libraries/beatmap/Beatmap";

export interface BeatmapsTableDataUnit {
  local: Beatmap | undefined;
  data: BeatsaverBeatmap;
}
