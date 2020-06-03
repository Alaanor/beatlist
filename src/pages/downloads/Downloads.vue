<template>
  <v-container>
    <p class="display-2">
      Downloads
    </p>

    <v-card>
      <v-card-text>
        <DownloadsListGroup
          sub-header="On going"
          type="ongoing"
          :operations="ongoing"
        />
        <DownloadsListGroup
          sub-header="Queued"
          type="queued"
          :operations="queued"
        />
        <DownloadsListGroup
          sub-header="Completed"
          type="completed"
          :operations="completed"
        />
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import DownloadsListGroup from "@/components/downloads/list/DownloadsListGroup.vue";
import DownloadLibrary from "@/libraries/net/downloader/DownloadLibrary";
import DownloadManager from "@/libraries/net/downloader/DownloadManager";
import { DownloadOperation } from "@/libraries/net/downloader/operation/DownloadOperation";
import DiscordRichPresence from "@/libraries/ipc/DiscordRichPresence";

export default Vue.extend({
  name: "Downloads",
  components: { DownloadsListGroup },
  data: () => ({
    queued: [] as DownloadOperation[],
    ongoing: [] as DownloadOperation[],
    completed: [] as DownloadOperation[],
  }),
  mounted(): void {
    DownloadManager.OnQueueUpdated(this.updateDownloadData);
    this.updateDownloadData();
  },
  beforeRouteEnter(to, from, next) {
    DiscordRichPresence.UpdateStatus("Checking his downloads");
    next();
  },
  beforeDestroy(): void {
    DownloadManager.RemoveOnQueueUpdatedListener(this.updateDownloadData);
  },
  methods: {
    updateDownloadData() {
      this.queued = DownloadLibrary.queuedOperation;
      this.ongoing = DownloadLibrary.ongoingOperation;
      this.completed = DownloadLibrary.completedOperation;
    },
  },
});
</script>
