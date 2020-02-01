import {
  IBeatmapDownloadNotification,
  ICommonNotification,
  IMessageNotification,
  INotificationType,
  NotificationState,
  NotificationType,
} from '@/libraries/notification/Notification';
import {
  DownloadOperationBeatmapResult,
} from '@/libraries/net/downloader/operation/beatmap/DownloadOperationBeatmapResult';

export default class NotificationFactory {
  public static CreateMessage(content: string, color?: string, icon?: string)
    : ICommonNotification & IMessageNotification {
    const notification = this.Make<IMessageNotification>();

    notification.type = NotificationType.Message;
    notification.content = content;
    notification.color = color;
    notification.icon = icon;

    return notification;
  }

  public static CreateBeatmapDownload(operationResult: DownloadOperationBeatmapResult)
    : ICommonNotification & IBeatmapDownloadNotification {
    const notification = this.Make<IBeatmapDownloadNotification>();

    notification.type = NotificationType.BeatmapDownload;
    notification.result = operationResult;

    return notification;
  }

  private static Make<T extends INotificationType>(): ICommonNotification & T {
    return {
      timeout: 5000,
      date: new Date(),
      state: NotificationState.ReadyToBeSend,
    } as ICommonNotification & T;
  }
}
