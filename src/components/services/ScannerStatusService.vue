<template>
  <div>
    <Tooltip
      text="Scanner"
      right
    >
      <v-btn
        icon
        :loading="isScanning"
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
        <v-card-text v-if="!isScanning">
          <p>There is no scan running at the moment.</p>
        </v-card-text>

        <v-card-text v-else-if="scanningBeatmap">
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

        <v-card-text v-else-if="scanningPlaylist">
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
            color="success"
            @click="scanAll()"
          >
            Scan all
          </v-btn>
          <v-btn
            text
            @click="dialog = false"
          >
            {{ isScanning ? 'Continue in background' : 'Close' }}
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
    latestResult: {
      beatmap: undefined as undefined | BeatmapScannerResult,
      playlist: undefined as undefined | PlaylistScannerResult,
    },
    scanningBeatmap: false,
    scanningPlaylist: false,
  }),
  computed: {
    isScanning(): boolean {
      return this.scanningBeatmap || this.scanningPlaylist;
    },
  },
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
    ScannerService.onScanningStateUpdate(this.onScanningStateUpdate);
  },
  methods: {
    scanAll(): void {
      ScannerService.ScanAll();
    },
    onBeatmapScanCompleted(result: BeatmapScannerResult): void {
      this.latestResult.beatmap = result;
    },
    onPlaylistScanCompleted(result: PlaylistScannerResult): void {
      this.latestResult.playlist = result;
    },
    onStatusDialogRequestOpen(): void {
      this.dialog = true;
    },
    onScanningStateUpdate(): void {
      this.scanningBeatmap = ScannerService.scanning.beatmap;
      this.scanningPlaylist = ScannerService.scanning.playlist;
    },
    onScanCompleted(): void {
      this.dialog = false;
      this.sendResultNotification();
    },
    sendResultNotification(): void {
      const message = [];

      if (this.latestResult.beatmap?.anyChange()) {
        message.push(this.latestResult.beatmap.toString());
      }

      if (this.latestResult.playlist?.anyChange()) {
        message.push(this.latestResult.playlist.toString());
      }

      if (message.length > 0) {
        NotificationService.NotifyMessage(message.join('. '), 'info', 'find_in_page', 10 * 1000);
      }
    },
  },
});
</script>

<style scoped>

</style>
