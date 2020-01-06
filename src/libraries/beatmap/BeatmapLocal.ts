import { BeatsaverBeatmap } from '@/libraries/net/beatsaver/BeatsaverBeatmap';
import { BeatmapLoadState } from './BeatmapLoadState';

export interface BeatmapLocal {
  folderPath: string;
  coverPath: string;
  songPath: string;
  onlineData: BeatsaverBeatmap;
  loadState: BeatmapLoadState;
}

export function isBeatmapLocal(beatmap: any): beatmap is BeatmapLocal {
  return (
    'folderPath' in beatmap
    && 'coverPath' in beatmap
    && 'songPath' in beatmap
    && 'onlineData' in beatmap
    && 'loadState' in beatmap
  );
}
