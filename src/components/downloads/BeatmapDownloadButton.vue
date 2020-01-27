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
      </v-icon>
      <template #loader>
        <v-progress-circular
          v-if="operation"
          color="success"
          :value="progressPercent()"
        />
      </template>
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
import { DownloadUnitProgress, DownloadUnitProgressFactory } from '@/libraries/net/downloader/DownloadUnit';

export default Vue.extend({
  name: 'BeatmapDownloadButton',
  components: { Tooltip },
  props: {
    beatmap: { type: Object as PropType<BeatsaverBeatmap>, required: true },
  },
  data: () => ({
    operation: undefined as DownloadOperation | undefined,
    progress: {} as DownloadUnitProgress,
    isDownloaded: false,
    isDownloading: false,
  }),
  computed: {
    tooltipText(): string {
      if (!this.isDownloading) {
        return 'Download';
      }

      return `${this.progress.bytes.received}/${this.progress.bytes.total}bytes, ${this.progress.time.remaining}s remaining`; // TODO create an helper to format the message here in better form
    },
  },
  mounted(): void {
    DownloadManager.Singleton.OnQueueUpdated(this.updateDownloadData);
    this.updateDownloadData();
  },
  methods: {
    downloadIt(): void {
      this.progress = DownloadUnitProgressFactory();
      const operation = new DownloadOperationBeatmap(this.beatmap, this.progress);
      operation.OnCompleted(() => this.notifyResult(operation));
      DownloadManager.Singleton.AddQueue(operation);
    },
    progressPercent(): string {
      return (this.progress.bytes.percent * 100).toString();
    },
    updateDownloadData(): void {
      this.isDownloaded = BeatmapLibrary.HasBeatmap(this.beatmap);
      this.isDownloading = DownloadManager.Singleton.HasBeatmapScheduled(this.beatmap);

      if (this.isDownloading) {
        this.operation = DownloadManager.Singleton.GetOperationFor(this.beatmap);
      } else {
        this.operation = undefined;
      }
    },
    notifyResult(operation: DownloadOperationBeatmap): void {
      NotificationService.NotifyBeatmapDownload(operation.result);
    },
  },
});
</script>

<style scoped>

</style>
