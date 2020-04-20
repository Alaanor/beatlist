import BeatmapLoadStateError from './BeatmapLoadStateError';

export interface BeatmapLoadState {
  valid: boolean;
  errorType: BeatmapLoadStateError;
  errorMessage: string;
}
