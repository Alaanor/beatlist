<template>
  <v-badge
    overlap
    color="blue"
    bottom
    left
    dot
    offset-x="34"
    offset-y="34"
    :value="isDownloading"
  >
    <Tooltip :text="DownloadTooltipText" right>
      <v-btn icon :to="toDownloadPage">
        <v-icon>cloud_download</v-icon>
      </v-btn>
    </Tooltip>
  </v-badge>
</template>

<script lang="ts">
import Vue from "vue";
import Tooltip from "@/components/helper/Tooltip.vue";
import DownloadManager from "@/libraries/net/downloader/DownloadManager";
import DownloadLibrary from "@/libraries/net/downloader/DownloadLibrary";
import route from "@/plugins/route/route";

export default Vue.extend({
  name: "DownloadGoToPageButton",
  components: { Tooltip },
  data: () => ({
    onGoingCount: 0,
    queuedCount: 0,
    completedCount: 0,
    toDownloadPage: { name: route.DOWNLOADS },
  }),
  computed: {
    isDownloading() {
      return this.onGoingCount + this.queuedCount > 0;
    },
    DownloadTooltipText() {
      const total = this.queuedCount + this.onGoingCount + this.completedCount;
      return `Download ${
        this.onGoingCount > 0 ? `${this.completedCount}/${total}` : ""
      }`;
    },
  },
  mounted(): void {
    DownloadManager.OnQueueUpdated(this.updateDownloadState);
  },
  beforeDestroy(): void {
    DownloadManager.RemoveOnQueueUpdatedListener(this.updateDownloadState);
  },
  methods: {
    updateDownloadState(): void {
      this.onGoingCount = DownloadLibrary.ongoingOperation.length;
      this.queuedCount = DownloadLibrary.queuedOperation.length;
      this.completedCount = DownloadLibrary.completedOperation.length;
    },
  },
});
</script>
