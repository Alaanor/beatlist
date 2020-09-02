<template>
  <v-snackbar
    v-model="snackbar"
    :color="snackbarColor"
    :timeout="0"
    right
    bottom
    :class="$vuetify.theme.dark ? '' : 'black--text'"
  >
    <v-icon v-if="notification.icon" class="pr-2">
      {{ notification.icon }}
    </v-icon>
    <span style="width: 100%;" v-html="notification.content" />
    <v-btn text color="secondary" class="ma-0" @click="close()">
      Close
    </v-btn>
  </v-snackbar>
</template>

<script lang="ts">
import Vue, { PropType } from "vue";
import {
  IMessageNotification,
  ICommonNotification,
  NotificationType,
} from "@/libraries/notification/Notification";
import NotificationLibrary from "@/libraries/notification/NotificationLibrary";

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
  computed: {
    snackbarColor(): string {
      if (
        this.notification.color !== "" &&
        this.notification.color !== undefined
      ) {
        return this.notification.color as string;
      }

      return this.$vuetify.theme.dark ? "" : "white";
    },
  },
  watch: {
    snackbar() {
      if (!this.snackbar) {
        setTimeout(
          () => NotificationLibrary.SetAsNotified(this.notification),
          250
        );
      }
    },
  },
  mounted(): void {
    setTimeout(() => {
      this.snackbar = false;
    }, this.notification.timeout);
  },
  methods: {
    close() {
      this.snackbar = false;
    },
  },
});
</script>
