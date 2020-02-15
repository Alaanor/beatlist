<template>
  <div>
    <Tooltip
      text="Scanner"
      right
    >
      <v-btn
        icon
        @click="dialog = true"
      >
        <v-icon>find_in_page</v-icon>
      </v-btn>
    </Tooltip>
    <v-dialog
      v-model="dialog"
      width="400"
    >
      <v-card>
        <v-card-title>Scanner</v-card-title>
        <v-card-text v-if="!isScanning()">
          <p>There is no scan running at the moment.</p>
        </v-card-text>

        <v-card-text v-else-if="scanning().beatmap">
          <p>
            Scanning beatmaps:
            {{ `${progress.beatmap.get().done} on ${progress.beatmap.get().total} done.` }}
          </p>
          <v-progress-linear
            :indeterminate="progress.beatmap === undefined"
            :value="progress.beatmap.getRatio() * 100"
            color="success"
            rounded
          />
        </v-card-text>

        <v-card-text v-else-if="scanning().playlist">
          <p>
            Scanning playlists:
            {{ `${progress.playlist.get().done} on ${progress.playlist.get().total} done.` }}
          </p>
          <v-progress-linear
            :indeterminate="progress.playlist === undefined"
            :value="progress.playlist.getRatio() * 100"
            color="success"
            rounded
          />
        </v-card-text>

        <v-card-actions>
          <v-spacer/>
          <v-btn
            text
            @click="dialog = false"
          >
            {{ isScanning() ? 'Continue in background' : 'Close' }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Tooltip from '@/components/helper/Tooltip.vue';
import Progress from '@/libraries/common/Progress';
import ProgressGroup from '@/libraries/common/ProgressGroup';
import NotificationService from '@/libraries/notification/NotificationService';
import ScannerService from '@/libraries/scanner/ScannerService';
import BeatmapScannerResult from '@/libraries/scanner/beatmap/BeatmapScannerResult';
import PlaylistScannerResult from '@/libraries/scanner/playlist/PlaylistScannerResult';

export default Vue.extend({
  name: 'ScannerStatusService',
  components: { Tooltip },
  data: () => ({
    dialog: false,
    progress: { beatmap: new Progress(), playlist: new ProgressGroup() },
  }),
  mounted(): void {
    ScannerService.OnBindBeatmapProgress(() => {
      this.progress.beatmap = new Progress();
      return this.progress.beatmap;
    });

    ScannerService.OnBindPlaylistProgress(() => {
      this.progress.playlist = new ProgressGroup();
      return this.progress.playlist;
    });

    ScannerService.onBeatmapScanCompleted(this.onBeatmapScanCompleted);
    ScannerService.onPlaylistScanCompleted(this.onPlaylistScanCompleted);

    ScannerService.onStatusDialogRequestOpen(this.onStatusDialogRequestOpen);
    ScannerService.onScanCompleted(this.onScanCompleted);
  },
  methods: {
    onBeatmapScanCompleted(result: BeatmapScannerResult) {
      if (result.anyChange()) {
        NotificationService.NotifyMessage(result.toString(), 'info', 'find_in_page', 10 * 1000);
      }
    },
    onPlaylistScanCompleted(result: PlaylistScannerResult) {
      if (result.anyChange()) {
        NotificationService.NotifyMessage(result.toString(), 'info', 'find_in_page', 10 * 1000);
      }
    },
    onStatusDialogRequestOpen() {
      this.dialog = true;
    },
    onScanCompleted() {
      this.dialog = false;
    },
    isScanning: () => ScannerService.isScanning,
    scanning: () => ScannerService.scanning,
  },
});
</script>

<style scoped>

</style>
