import {
  ICommonNotification,
  IMessageNotification,
  INotificationType,
  NotificationState,
  NotificationType,
} from '@/libraries/notification/Notification';

export default class NotificationFactory {
  public static CreateMessage(content: string, color: string | undefined)
    : ICommonNotification & IMessageNotification {
    const notification = this.Make<IMessageNotification>();
    notification.type = NotificationType.Message;
    notification.content = content;
    notification.color = color;
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
