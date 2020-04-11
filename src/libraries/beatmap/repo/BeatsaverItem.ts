import { BeatsaverBeatmap } from '@/libraries/net/beatsaver/BeatsaverBeatmap';

export enum BeatsaverItemLoadError {
  BeatmapNotOnBeatsaver = 0,
  BeatsaverServerNotAvailable = 1,
  InvalidDataReceivedFromBeatsaver = 2,
  BeatsaverRateLimited = 3,
  Unknown = 4,
}

export interface BeatsaverItemLoadState {
  valid: boolean,
  errorType: BeatsaverItemLoadError | undefined,
  errorMessage: string | undefined,
}

export interface BeatsaverItem {
  beatmap: BeatsaverBeatmap | undefined,
  loadState: BeatsaverItemLoadState,
}

export default {};
