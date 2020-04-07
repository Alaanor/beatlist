import { BeatsaverBeatmap } from '@/libraries/net/beatsaver/BeatsaverBeatmap';
import { PlaylistLoadState } from '@/libraries/playlist/loader/PlaylistLoadState';
import PlaylistFormatType from '@/libraries/playlist/PlaylistFormatType';

export interface PlaylistBase {
  title: string;
  author: string;
  description: string | null;
  cover: Buffer | null;
  maps: PlaylistMap[],
}

export interface PlaylistLocal extends PlaylistBase {
  path: string | undefined;
  hash: string | undefined;
  maps: PlaylistLocalMap[];
  loadState: PlaylistLoadState;
  format: PlaylistFormatType;
}

export interface PlaylistOnline extends PlaylistBase {
  maps: PlaylistOnlineMap[];
}

export interface PlaylistMap {
  online: BeatsaverBeatmap | null;
  dateAdded: Date;
}

export interface PlaylistLocalMap extends PlaylistMap {
  error: PlaylistMapImportError | null;
  errorInfo: string;
}

export interface PlaylistOnlineMap extends PlaylistMap {}

export enum PlaylistMapImportError {
  BeatmapTypeZipNotSupported = 0,
  BeatmapTypeLevelIdNotSupported = 1,
  BeatmapTypeUnknown = 2,
  BeatsaverInexistent = 3,
  BeatsaverRequestError = 4,
}
