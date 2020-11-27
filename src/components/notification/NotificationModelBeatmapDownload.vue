<template>
  <v-snackbar
    v-model="snackbar"
    :color="snackbarColor"
    :timeout="0"
    bottom
    right
  >
    <v-list v-if="isSuccess" style="background: none;" class="pa-0">
      <v-list-item class="pa-0">
        <v-list-item-avatar class="my-0">
          <AlbumLoader :beatmap="beatmap" />
        </v-list-item-avatar>
        <v-list-item-content class="py-0">
          <v-list-item-title>{{ beatmap.metadata.songName }}</v-list-item-title>
          <v-list-item-subtitle>
            The beatmap has successfully been downloaded.
          </v-list-item-subtitle>
        </v-list-item-content>
        <v-list-item-action class="ma-0">
          <v-btn text color="secondary" class="ma-0" @click="close()">
            Close
          </v-btn>
        </v-list-item-action>
      </v-list-item>
    </v-list>
    <span v-else>
      {{ errorText }}
    </span>
  </v-snackbar>
</template>

<script lang="ts">
import Vue, { PropType } from "vue";
import {
  NotificationType,
  ICommonNotification,
  IBeatmapDownloadNotification,
} from "@/libraries/notification/Notification";
import NotificationLibrary from "@/libraries/notification/NotificationLibrary";
import {
  DownloadOperationBeatmapResult,
  DownloadOperationBeatmapResultStatus,
} from "@/libraries/net/downloader/operation/beatmap/DownloadOperationBeatmapResult";
import AlbumLoader from "@/components/beatmap/cover/AlbumLoader.vue";
import { BeatsaverBeatmap } from "@/libraries/net/beatsaver/BeatsaverBeatmap";

export default Vue.extend({
  name: `NotificationModel${NotificationType.BeatmapDownload}`,
  components: { AlbumLoader },
  props: {
    notification: {
      type: Object as PropType<
        ICommonNotification & IBeatmapDownloadNotification
      >,
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
    snackbarColor(): string | undefined {
      switch (
        this.notification.result.status as DownloadOperationBeatmapResultStatus
      ) {
        case DownloadOperationBeatmapResultStatus.DownloadError:
        case DownloadOperationBeatmapResultStatus.ExtractionError:
        case DownloadOperationBeatmapResultStatus.IOError:
          return "error";

        case DownloadOperationBeatmapResultStatus.Success:
        default:
          return this.$vuetify.theme.dark ? "" : "white";
      }
    },
    isSuccess(): boolean {
      const status = this.notification.result
        .status as DownloadOperationBeatmapResultStatus;
      return status === DownloadOperationBeatmapResultStatus.Success;
    },
    errorText(): string {
      const result = this.notification.result as DownloadOperationBeatmapResult;
      switch (result.status) {
        case DownloadOperationBeatmapResultStatus.DownloadError:
        case DownloadOperationBeatmapResultStatus.ExtractionError:
        case DownloadOperationBeatmapResultStatus.IOError:
          return result.errorWritten;

        default:
          return "";
      }
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
