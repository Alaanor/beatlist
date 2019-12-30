import { make } from 'vuex-pathify';
import { INotification, NotificationState } from '@/libraries/notification/Notification';

const state = {
  notifications: [],
};

const getters = {
  ...make.getters(state),
};

const mutations = {
  ...make.mutations(state),
  add(context: any, payload: { notification: INotification }) {
    context.notifications.push(payload.notification);
  },
  setAsNotified(context: any, payload: { notification: INotification }) {
    const notif = context.notifications
      .find((notification: INotification) => notification === payload.notification);

    if (notif !== undefined) {
      notif.state = NotificationState.Dismissed;
    }
  },
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
};
