import { PlaylistLoadState } from "@/libraries/playlist/loader/PlaylistLoadState";
import PlaylistFormatType from "@/libraries/playlist/PlaylistFormatType";
import { BeatsaverKey } from "@/libraries/beatmap/repo/BeatsaverKeyType";

export interface PlaylistBase {
  title: string;
  author: string;
  description: string | null;
  cover: Buffer | null;
  maps: PlaylistMap[];
}

export interface PlaylistLocal extends PlaylistBase {
  path: string | undefined;
  hash: string | undefined;
  maps: PlaylistLocalMap[];
  loadState: PlaylistLoadState;
  format: PlaylistFormatType;
}

export interface PlaylistMap {
  hash: string | undefined;
  dateAdded: Date;
}

export interface PlaylistValidMap extends PlaylistMap {
  hash: string;
}

export interface PlaylistLocalMap extends PlaylistMap {
  error: PlaylistMapImportError | undefined;
  errorInfo: string | undefined;
  attemptedSource: BeatsaverKey;
}

export enum PlaylistMapImportError {
  BeatmapTypeLevelIdNotSupported = 0,
  BeatsaverInexistent = 1,
  BeatsaverRequestError = 2,
  Unknown = 3,
}
