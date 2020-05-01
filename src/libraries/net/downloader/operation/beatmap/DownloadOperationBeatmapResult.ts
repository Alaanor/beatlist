import { BeatsaverBeatmap } from "@/libraries/net/beatsaver/BeatsaverBeatmap";

export enum DownloadOperationBeatmapResultStatus {
  Init = 0,
  Downloading = 1,
  Extracting = 2,
  Success = 3,
  DownloadError = 4,
  ExtractionError = 5,
  IOError = 6,
}

export type DownloadOperationBeatmapResult = DownloadOperationBeatmapResultBase &
  (
    | DownloadOperationBeatmapResultInProgress
    | DownloadOperationBeatmapResultDone
    | DownloadOperationBeatmapResultError
  );

export interface DownloadOperationBeatmapResultBase {
  beatmap: BeatsaverBeatmap;
  status: DownloadOperationBeatmapResultStatus;
}

export interface DownloadOperationBeatmapResultInProgress {
  status:
    | DownloadOperationBeatmapResultStatus.Init
    | DownloadOperationBeatmapResultStatus.Downloading
    | DownloadOperationBeatmapResultStatus.Extracting;
}

export interface DownloadOperationBeatmapResultDone {
  status: DownloadOperationBeatmapResultStatus.Success;
  path: string;
}

export interface DownloadOperationBeatmapResultError {
  status:
    | DownloadOperationBeatmapResultStatus.ExtractionError
    | DownloadOperationBeatmapResultStatus.DownloadError
    | DownloadOperationBeatmapResultStatus.IOError;
  errorWritten: string;
}
