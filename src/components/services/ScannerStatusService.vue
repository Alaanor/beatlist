<template>
  <v-dialog v-model="dialog" width="400">
    <v-card>
      <v-card-title>Scanner</v-card-title>
      <v-card-text v-if="!isScanning">
        <p>There is no scan running at the moment.</p>
      </v-card-text>

      <v-card-text v-else-if="scanningBeatmap">
        <p>
          Scanning beatmaps:
          {{
            `${progress.beatmap.get().done} of ${
              progress.beatmap.get().total
            } done.`
          }}
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
          {{
            `${progress.playlist.get().done} of ${
              progress.playlist.get().total
            } done.`
          }}
        </p>
        <v-progress-linear
          :indeterminate="progress.playlist === undefined"
          :value="progress.playlist.getRatio() * 100"
          color="success"
          rounded
        />
      </v-card-text>

      <v-card-actions>
        <v-spacer />
        <v-btn v-if="!isScanning" text color="success" @click="scanAll()">
          Scan all
        </v-btn>
        <v-btn text @click="dialog = false">
          {{ isScanning ? "Continue in background" : "Close" }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import Vue from "vue";
import Progress from "@/libraries/common/Progress";
import ProgressGroup from "@/libraries/common/ProgressGroup";
import ScannerService from "@/libraries/scanner/ScannerService";
import NotificationServiceScanner from "@/libraries/notification/NotificationServiceScanner";

export default Vue.extend({
  name: "ScannerStatusService",
  data: () => ({
    dialog: false,
    progress: { beatmap: new Progress(), playlist: new ProgressGroup() },
    scanningBeatmap: false,
    scanningPlaylist: false,
  }),
  computed: {
    isScanning(): boolean {
      return this.scanningBeatmap || this.scanningPlaylist;
    },
  },
  mounted(): void {
    this.updateProgressListener();

    ScannerService.onScanStart(this.updateProgressListener);
    ScannerService.onStatusDialogRequestOpen(this.onStatusDialogRequestOpen);
    ScannerService.onScanCompleted(this.onScanCompleted);
    ScannerService.onScanningStateUpdate(this.onScanningStateUpdate);
  },
  beforeDestroy(): void {
    ScannerService.offScanStart(this.updateProgressListener);
    ScannerService.offStatusDialogRequestOpen(this.onStatusDialogRequestOpen);
    ScannerService.offScanCompleted(this.onScanCompleted);
    ScannerService.offScanningStateUpdate(this.onScanningStateUpdate);
  },
  methods: {
    scanAll(): void {
      ScannerService.ScanAll();
      NotificationServiceScanner.notifyOnNextScan();
    },
    onStatusDialogRequestOpen(): void {
      this.dialog = true;
      this.updateProgressListener();
    },
    onScanningStateUpdate(): void {
      this.scanningBeatmap = ScannerService.scanning.beatmap;
      this.scanningPlaylist = ScannerService.scanning.playlist;
    },
    onScanCompleted(): void {
      this.dialog = false;
      ScannerService.beatmapProgress.offPlusOne(this.updateProgress);
      ScannerService.playlistProgress.offPlusOne(this.updateProgress);
    },
    updateProgressListener(): void {
      ScannerService.beatmapProgress.onPlusOne(this.updateProgress);
      ScannerService.playlistProgress.onPlusOne(this.updateProgress);
    },
    updateProgress(): void {
      this.progress.beatmap = ScannerService.beatmapProgress;
      this.progress.playlist = ScannerService.playlistProgress;
    },
  },
});
</script>
