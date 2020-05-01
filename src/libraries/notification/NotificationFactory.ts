import {
  IBeatmapDownloadNotification,
  ICommonNotification,
  IMessageNotification,
  INotificationType,
  NotificationState,
  NotificationType,
} from "@/libraries/notification/Notification";
import { DownloadOperationBeatmapResult } from "@/libraries/net/downloader/operation/beatmap/DownloadOperationBeatmapResult";

export default class NotificationFactory {
  public static CreateMessage(
    content: string,
    color?: string,
    icon?: string,
    timeout?: number
  ): ICommonNotification & IMessageNotification {
    const notification = this.Make<IMessageNotification>(timeout);

    notification.type = NotificationType.Message;
    notification.content = content;
    notification.color = color;
    notification.icon = icon;

    return notification;
  }

  public static CreateBeatmapDownload(
    operationResult: DownloadOperationBeatmapResult
  ): ICommonNotification & IBeatmapDownloadNotification {
    const notification = this.Make<IBeatmapDownloadNotification>();

    notification.type = NotificationType.BeatmapDownload;
    notification.result = operationResult;

    return notification;
  }

  private static Make<T extends INotificationType>(
    timeout: number = 5000
  ): ICommonNotification & T {
    return {
      timeout,
      date: new Date(),
      state: NotificationState.ReadyToBeSend,
    } as ICommonNotification & T;
  }
}
