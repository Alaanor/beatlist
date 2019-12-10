import { BeatsaverBeatmap } from '../net/beatsaver/BeatsaverBeatmap';
import { BeatmapLoadState } from './BeatmapLoadState';

export interface BeatmapLocal {
  folderPath: string;
  coverPath: string;
  songPath: string;
  onlineData: BeatsaverBeatmap;
  loadState: BeatmapLoadState;
}
