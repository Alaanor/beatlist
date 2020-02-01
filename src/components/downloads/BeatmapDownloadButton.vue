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
        <DownloadProgressCircular :operation="operation"/>
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
import DownloadLibrary from '@/libraries/net/downloader/DownloadLibrary';
import DownloadProgressCircular from '@/components/downloads/DownloadProgressCircular.vue';
import { FormatProgressAllInOne } from '@/libraries/net/downloader/DownloadUnitProgress';
import BeatmapInstaller from '@/libraries/os/beatSaber/installer/BeatmapInstaller';

export default Vue.extend({
  name: 'BeatmapDownloadButton',
  components: { Tooltip, DownloadProgressCircular },
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
      if (this.isDownloading && this.operation) {
        return FormatProgressAllInOne(this.operation.progress);
      }

      return 'Download';
    },
  },
  mounted(): void {
    DownloadManager.OnQueueUpdated(this.updateDownloadData);
    this.updateDownloadData();
  },
  beforeDestroy(): void {
    DownloadManager.RemoveOnQueueUpdatedListener(this.updateDownloadData);
  },
  methods: {
    downloadIt(): void {
      BeatmapInstaller.Install(this.beatmap, this.notifyResult);
    },
    updateDownloadData(): void {
      this.isDownloaded = BeatmapLibrary.HasBeatmap(this.beatmap);
      this.isDownloading = DownloadLibrary.HasBeatmapScheduled(this.beatmap);

      if (this.isDownloading) {
        this.operation = DownloadLibrary.GetOperationFor(this.beatmap);
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
