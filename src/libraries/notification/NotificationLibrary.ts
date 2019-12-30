import { INotification, NotificationState } from '@/libraries/notification/Notification';
import store from '@/plugins/store';

export default class NotificationLibrary {
  public static GetAll() {
    return store.getters['notification/notifications'];
  }

  public static GetAllUnnotified() {
    return this.GetAll().filter(
      (notification: INotification) => notification.state === NotificationState.ReadyToBeSend,
    );
  }

  public static Add(notification: INotification) {
    store.commit('notification/add', { notification });
  }

  public static SetAsNotified(notification: INotification) {
    store.commit('notification/setAsNotified', { notification });
  }
}
