import PlaylistLoadStateError from '@/libraries/playlist/loader/PlaylistLoadStateError';

export type PlaylistLoadState = PlaylistLoadStateBase
  & (PlaylistLoadStateValid | PlaylistLoadStateInvalid);

export interface PlaylistLoadStateBase {
  valid: boolean;
}

export interface PlaylistLoadStateValid {
  valid: true,
  hasBeenConverted: boolean,
}

export interface PlaylistLoadStateInvalid {
  valid: false,
  errorType: PlaylistLoadStateError | undefined;
  errorMessage: string | undefined;
}
