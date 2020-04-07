import PlaylistLoadStateError from '@/libraries/playlist/loader/PlaylistLoadStateError';
import PlaylistFormatType from '@/libraries/playlist/PlaylistFormatType';

export type PlaylistLoadState = PlaylistLoadStateBase
  & (PlaylistLoadStateValid | PlaylistLoadStateInvalid);

export interface PlaylistLoadStateBase {
  valid: boolean;
}

export interface PlaylistLoadStateValid {
  valid: true,
  format: PlaylistFormatType | undefined;
}

export interface PlaylistLoadStateInvalid {
  valid: false,
  errorType: PlaylistLoadStateError | undefined;
  errorMessage: string | undefined;
}
