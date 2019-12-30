import { INotification } from '@/libraries/notification/Notification';
import NotificationLibrary from '@/libraries/notification/NotificationLibrary';
import NotificationFactory from '@/libraries/notification/NotificationFactory';

export default class NotificationService {
  public static Notify(notification: INotification) {
    this.SendNotification(notification);
  }

  public static NotifyMessage(content: string, color: string | undefined) {
    const notification = NotificationFactory.CreateMessage(content, color);
    this.SendNotification(notification);
  }

  private static SendNotification(notification: INotification) {
    NotificationLibrary.Add(notification);
  }
}
