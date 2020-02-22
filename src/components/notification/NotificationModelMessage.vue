<template>
  <v-snackbar
    v-model="snackbar"
    :color="notification.color"
    :timeout="notification.timeout"
    @input="checkForDismissed()"
  >
    <v-icon
      v-if="notification.icon"
      class="pr-2"
    >
      {{ notification.icon }}
    </v-icon>
    <span
      style="width: 100%"
      v-html="notification.content"
    />
    <v-btn
      text
      class="ma-0"
      @click="close()"
    >
      Close
    </v-btn>
  </v-snackbar>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import {
  IMessageNotification,
  ICommonNotification,
  NotificationType,
} from '@/libraries/notification/Notification';
import NotificationLibrary from '@/libraries/notification/NotificationLibrary';

export default Vue.extend({
  name: `NotificationModel${NotificationType.Message}`,
  props: {
    notification: {
      type: Object as PropType<ICommonNotification & IMessageNotification>,
      required: true,
    },
  },
  data: () => ({
    snackbar: true,
  }),
  methods: {
    close() {
      this.snackbar = false;
      NotificationLibrary.SetAsNotified(this.notification);
    },
    checkForDismissed() {
      if (!this.snackbar) {
        NotificationLibrary.SetAsNotified(this.notification);
      }
    },
  },
});
</script>

<style scoped>

</style>
