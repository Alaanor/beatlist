import BeatmapLoadStateError from './BeatmapLoadStateError';

export interface BeatmapLoadState {
  valid: boolean;
  errorType: BeatmapLoadStateError;
}
