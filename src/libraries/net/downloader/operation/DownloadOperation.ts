import { DownloadUnitProgress } from '@/libraries/net/downloader/DownloadUnit';

export enum DownloadOperationType {
  Beatmap = 'Beatmap',
  Playlist = 'Playlist',
}

export interface DownloadOperation {
  Start(): Promise<void>;
  OnCompleted(callback: (result: any) => void): void;
  progress: DownloadUnitProgress | undefined;
  isCompleted: boolean;
  type: DownloadOperationType;
}
