import {
  IKeyedNotification,
  INotification,
  NotificationState,
} from "@/libraries/notification/Notification";
import store from "@/plugins/store";

export default class NotificationLibrary {
  public static GetAll() {
    return store.getters["notification/notifications"];
  }

  public static GetAllUnnotified(): IKeyedNotification[] {
    return this.GetAll()
      .map((notification: INotification, index: number) => ({
        ...notification,
        key: index,
      }))
      .filter(
        (notification: IKeyedNotification) =>
          notification.state === NotificationState.ReadyToBeSend
      );
  }

  public static Add(notification: INotification) {
    store.commit("notification/add", { notification });
  }

  public static SetAsNotified(notification: INotification) {
    store.commit("notification/setAsNotified", { notification });
  }
}
