import { INotification } from '@/libraries/notification/Notification';
import NotificationLibrary from '@/libraries/notification/NotificationLibrary';
import NotificationFactory from '@/libraries/notification/NotificationFactory';
import { DownloadOperationBeatmapResult } from '@/libraries/net/downloader/operation/beatmap/DownloadOperationBeatmapResult';

export const NOTIFICATION_ICON_SUCCESS: string = 'check';
export const NOTIFICATION_ICON_DELETE: string = 'delete';

export default class NotificationService {
  public static Notify(notification: INotification) {
    this.SendNotification(notification);
  }

  public static NotifyMessage(content: string, color?: string, icon?: string, timeout?: number) {
    const notification = NotificationFactory.CreateMessage(content, color, icon, timeout);
    this.SendNotification(notification);
  }

  public static NotifyBeatmapDownload(operationResult: DownloadOperationBeatmapResult) {
    const notification = NotificationFactory.CreateBeatmapDownload(operationResult);
    this.SendNotification(notification);
  }

  private static SendNotification(notification: INotification) {
    NotificationLibrary.Add(notification);
  }
}
