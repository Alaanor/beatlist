import { BeatsaverBeatmap } from '@/libraries/net/beatsaver/BeatsaverBeatmap';
import { PlaylistLoadState } from '@/libraries/playlist/PlaylistLoadState';

export type PlaylistLocal = PlaylistStoredLocally & PlaylistWithBeatmapLocal;

interface PlaylistStoredLocally {
  path: string;
  hash: string;
}

export interface PlaylistWithBeatmapLocal {
  title: string;
  author: string;
  description: string | null;
  cover: Buffer | null;
  maps: PlaylistLocalMap[];
  loadState: PlaylistLoadState;
}

export interface PlaylistLocalMap {
  dateAdded: Date;
  error: PlaylistMapImportError | null,
  online: BeatsaverBeatmap | null;
}

export enum PlaylistMapImportError {
  BeatmapTypeZipNotSupported = 0,
  BeatmapTypeLevelIdNotSupported = 1,
  BeatmapTypeUnknown = 2,
  BeatsaverRequestError = 3,
}
