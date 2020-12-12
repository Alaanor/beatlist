import { BeatsaverBeatmap } from "@/libraries/net/beatsaver/BeatsaverBeatmap";
import { BeatsaverKey } from "@/libraries/beatmap/repo/BeatsaverKeyType";

export enum BeatsaverItemLoadError {
  BeatmapNotOnBeatsaver = 0,
  BeatsaverServerNotAvailable = 1,
  InvalidDataReceivedFromBeatsaver = 2,
  BeatsaverRateLimited = 3,
  Unknown = 4,
  RequestTimeout = 5,
}

export interface BeatsaverItemLoadState {
  valid: boolean;
  errorType: BeatsaverItemLoadError | undefined;
  errorMessage: string | undefined;
  attemptedSource: BeatsaverKey;
}

export type BeatsaverItem = BeatsaverItemValid | BeatsaverItemInvalid;

export interface BeatsaverItemValid {
  beatmap: BeatsaverBeatmap;
  loadState: BeatsaverItemLoadState;
}

export interface BeatsaverItemInvalid {
  beatmap: undefined;
  loadState: BeatsaverItemLoadState;
  date: Date;
}

export default {};
