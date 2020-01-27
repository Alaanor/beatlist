<template>
  <Tooltip :text="tooltipText">
    <v-btn
      icon
      :disabled="isDownloaded || isDownloading"
      :loading="isDownloading"
      @click="downloadIt()"
    >
      <v-icon
        color="success"
      >
        mdi-download
        <template #loader>
          <v-progress-circular
            v-if="operation"
            color="success"
            :value="operation.progress.bytes.percent * 100"
          />
        </template>
      </v-icon>
    </v-btn>
  </Tooltip>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import { BeatsaverBeatmap } from '@/libraries/net/beatsaver/BeatsaverBeatmap';
import DownloadManager from '@/libraries/net/downloader/DownloadManager';
import BeatmapLibrary from '@/libraries/beatmap/BeatmapLibrary';
import Tooltip from '@/components/helper/Tooltip.vue';
import DownloadOperationBeatmap from '@/libraries/net/downloader/operation/beatmap/DownloadOperationBeatmap';
import { DownloadOperation } from '@/libraries/net/downloader/operation/DownloadOperation';
import NotificationService from '@/libraries/notification/NotificationService';

export default Vue.extend({
  name: 'BeatmapDownloadButton',
  components: { Tooltip },
  props: {
    beatmap: { type: Object as PropType<BeatsaverBeatmap>, required: true },
  },
  data: () => ({
    operation: undefined as DownloadOperation | undefined,
    isDownloaded: false,
    isDownloading: false,
  }),
  computed: {
    tooltipText(): string {
      if (!this.operation?.progress) {
        return 'Download';
      }

      return `${this.operation?.progress.bytes.received}/${this.operation?.progress.bytes.total}bytes, ${this.operation?.progress.time.remaining}s remaining`; // TODO create an helper to format the message here in better form
    },
  },
  mounted(): void {
    DownloadManager.Singleton.OnQueueUpdated(this.updateDownloadData);
    this.updateDownloadData();
  },
  methods: {
    downloadIt(): void {
      const operation = new DownloadOperationBeatmap(this.beatmap);
      operation.OnCompleted(() => this.notifyResult(operation));
      DownloadManager.Singleton.AddQueue(operation);
    },
    updateDownloadData() {
      this.isDownloaded = BeatmapLibrary.HasBeatmap(this.beatmap);
      this.isDownloading = DownloadManager.Singleton.HasBeatmapScheduled(this.beatmap);

      if (this.isDownloading) {
        this.operation = DownloadManager.Singleton.GetOperationFor(this.beatmap);
      } else {
        this.operation = undefined;
      }
    },
    notifyResult(operation: DownloadOperationBeatmap) {
      NotificationService.NotifyBeatmapDownload(operation.result);
    },
  },
});
</script>

<style scoped>

</style>
