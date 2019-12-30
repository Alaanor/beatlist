import { BeatsaverBeatmap } from '@/libraries/net/beatsaver/BeatsaverBeatmap';

export const enum NotificationState {
  ReadyToBeSend = 0,
  Dismissed = 1,
}

export interface ICommonNotification {
  timeout: number;
  date: Date;
  state: NotificationState;
}

export const enum NotificationType {
  Message = 'Message',
  BeatmapDownload = 'BeatmapDownload',
}

export interface INotificationType {
  type: NotificationType;
}

export interface IMessageNotification extends INotificationType {
  type: NotificationType.Message;
  content: string;
  color: string | undefined;
}

export interface IBeatmapDownloadNotification extends INotificationType {
  type: NotificationType.BeatmapDownload;
  beatmap: BeatsaverBeatmap;
}

export type INotification = ICommonNotification & (
  IMessageNotification |
  IBeatmapDownloadNotification
);
