import { BeatsaverBeatmap } from '@/libraries/net/beatsaver/BeatsaverBeatmap';

export interface PlaylistLocal {
  title: string;
  author: string;
  description: string | null;
  cover: Buffer;
  maps: PlaylistLocalMap[];
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
}
