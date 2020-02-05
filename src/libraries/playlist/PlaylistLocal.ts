import { BeatsaverBeatmap } from '@/libraries/net/beatsaver/BeatsaverBeatmap';
import { PlaylistLoadState } from '@/libraries/playlist/PlaylistLoadState';

export interface PlaylistBase {
  title: string;
  author: string;
  description: string | null;
  cover: Buffer | null;
  maps: any[],
}

export interface PlaylistLocal extends PlaylistBase {
  path: string;
  hash: string;
  maps: PlaylistLocalMap[];
  loadState: PlaylistLoadState;
}

export interface PlaylistOnline extends PlaylistBase {
  maps: PlaylistOnlineMap[];
}

export interface PlaylistLocalMap {
  dateAdded: Date;
  error: PlaylistMapImportError | null,
  online: BeatsaverBeatmap | null;
}

export interface PlaylistOnlineMap {
  dateAdded: Date;
  online: BeatsaverBeatmap | null;
}

export enum PlaylistMapImportError {
  BeatmapTypeZipNotSupported = 0,
  BeatmapTypeLevelIdNotSupported = 1,
  BeatmapTypeUnknown = 2,
  BeatsaverRequestError = 3,
}
