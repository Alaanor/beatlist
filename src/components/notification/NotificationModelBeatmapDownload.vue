<template>
  <v-snackbar
    v-model="snackbar"
    :color="snackbarColor"
    :timeout="notification.timeout"
    @input="checkForDismissed()"
  >
    <v-list
      class="pa-0"
      :color="snackbarColor"
    >
      <v-list-item class="pa-0">
        <v-list-item-avatar class="my-0">
          <BeatmapCover :beatmap="beatmap"/>
        </v-list-item-avatar>
        <v-list-item-content class="py-0">
          <v-list-item-title>{{ beatmap.metadata.songName }}</v-list-item-title>
          <v-list-item-subtitle>The beatmap has successfully been downloaded.</v-list-item-subtitle>
        </v-list-item-content>
        <v-list-item-action>
          <v-btn
            text
            @click="close()"
          >
            Close
          </v-btn>
        </v-list-item-action>
      </v-list-item>
    </v-list>
  </v-snackbar>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import {
  NotificationType,
  ICommonNotification,
  IBeatmapDownloadNotification,
} from '@/libraries/notification/Notification';
import NotificationLibrary from '@/libraries/notification/NotificationLibrary';
import { DownloadOperationBeatmapResultStatus } from '@/libraries/net/downloader/operation/beatmap/DownloadOperationBeatmapResult';
import BeatmapCover from '@/components/beatmap/cover/BeatmapCover.vue';
import { BeatsaverBeatmap } from '@/libraries/net/beatsaver/BeatsaverBeatmap';

export default Vue.extend({
  name: `NotificationModel${NotificationType.BeatmapDownload}`,
  components: { BeatmapCover },
  props: {
    notification: {
      type: Object as PropType<ICommonNotification & IBeatmapDownloadNotification>,
      required: true,
    },
  },
  data: () => ({
    snackbar: true,
  }),
  computed: {
    beatmap(): BeatsaverBeatmap {
      return this.notification.result.beatmap;
    },
    snackbarColor(): string {
      switch (this.notification.result.status as DownloadOperationBeatmapResultStatus) {
        case DownloadOperationBeatmapResultStatus.Success:
          return 'success';

        case DownloadOperationBeatmapResultStatus.DownloadError:
        case DownloadOperationBeatmapResultStatus.ExtractionError:
        case DownloadOperationBeatmapResultStatus.IOError:
          return 'error';

        default:
          return '';
      }
    },
  },
  methods: {
    close(): void {
      this.snackbar = false;
      NotificationLibrary.SetAsNotified(this.notification);
    },
    checkForDismissed(): void {
      if (!this.snackbar) {
        NotificationLibrary.SetAsNotified(this.notification);
      }
    },
  },
});
</script>

<style scoped>

</style>
