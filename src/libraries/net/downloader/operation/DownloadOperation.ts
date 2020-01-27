import { BeatsaverBeatmap } from '@/libraries/net/beatsaver/BeatsaverBeatmap';
import { DownloadOperationBeatmapResult } from '@/libraries/net/downloader/operation/beatmap/DownloadOperationBeatmapResult';
import { DownloadUnitProgress } from '@/libraries/net/downloader/DownloadUnit';

export enum DownloadOperationType {
  Beatmap = 'Beatmap',
  Playlist = 'Playlist',
}

export type DownloadOperation = DownloadOperationBase & (
  DownloadOperationTypeBeatmap
)

export interface DownloadOperationBase {
  type: DownloadOperationType;
  Start(): Promise<void>;
  OnCompleted(callback: (result: any) => void): void;
  isCompleted: boolean;
}

export interface DownloadOperationTypeBeatmap {
  type: DownloadOperationType.Beatmap;
  result: DownloadOperationBeatmapResult;
  progress: DownloadUnitProgress;
  beatmap: BeatsaverBeatmap;
}
