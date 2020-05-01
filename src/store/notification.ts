import { make } from "vuex-pathify";
import {
  IKeyedNotification,
  INotification,
  NotificationState,
} from "@/libraries/notification/Notification";

export interface NotificationStoreState {
  notifications: INotification[];
}

const state = {
  notifications: [],
};

const getters = {
  ...make.getters(state),
};

const mutations = {
  ...make.mutations(state),
  add(
    context: NotificationStoreState,
    payload: { notification: INotification }
  ) {
    context.notifications.push(payload.notification);
  },
  setAsNotified(
    context: NotificationStoreState,
    payload: { notification: IKeyedNotification }
  ) {
    context.notifications[payload.notification.key].state =
      NotificationState.Dismissed;
  },
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
};
