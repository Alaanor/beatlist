<template>
  <v-container>
    <p class="display-1">
      Library
    </p>
    <v-container>
      <p v-if="isRateLimited" class="warning--text">
        Currently rate-limited, reset in
        {{ rateLimitResetInSecond }}
        seconds. You can continue to use the application, it will continue
        automatically in background.
      </p>
      <v-row>
        <v-col
          cols="auto"
          class="d-flex align-center justify-center flex-column py-0"
        >
          <ScanAllButton color="success" />
          <v-btn
            :disabled="canClearCache()"
            color="warning"
            class="my-2"
            @click="openConfirmDialogCache()"
          >
            Clear cache
          </v-btn>
        </v-col>

        <v-col class="d-flex justify-center align-start flex-column py-0">
          <span>
            <strong>{{ beatmapsCountValid() }}</strong>
            {{ beatmapsCountValid() === 1 ? "beatmap" : "beatmaps" }}
            loaded.
          </span>
          <span>
            <strong>{{ playlistsCountValid() }}</strong>
            {{ playlistsCountValid() === 1 ? "playlist is" : "playlists" }}
            loaded.
          </span>
          <span>
            <strong>{{ beatsaverBeatmapCountValid() }}</strong>
            {{
              beatsaverBeatmapCountValid() === 1 ? "beatmap is" : "beatmaps are"
            }}
            cached.
            <Tooltip
              right
              text="Caches information such as <br> vote and download data."
            >
              <v-icon x-small>mdi-help</v-icon>
            </Tooltip>
          </span>
          <span class="py-1" />

          <span
            v-if="beatmapsCountInvalid() > 0"
            class="grey--text d-flex align-center"
          >
            <strong class="pr-1">{{ beatmapsCountInvalid() }}</strong>
            {{ beatmapsCountValid() > 1 ? "beatmaps are" : "beatmap is" }}
            invalid.
            <v-btn
              icon
              x-small
              class="ml-1"
              @click.stop="invalidBeatmapDialog = true"
            >
              <v-icon x-small>mdi-help</v-icon>
            </v-btn>
          </span>

          <span
            v-if="playlistsCountInvalid() > 0"
            class="grey--text d-flex align-center"
          >
            <strong class="pr-1">{{ playlistsCountInvalid() }}</strong>
            {{ playlistsCountInvalid() > 1 ? "playlists are" : "playlist is" }}
            invalid.
            <v-btn
              icon
              x-small
              class="ml-1"
              @click.stop="invalidPlaylistDialog = true"
            >
              <v-icon x-small>mdi-help</v-icon>
            </v-btn>
          </span>

          <span
            v-if="playlistsMapsCountInvalid() > 0"
            class="grey--text d-flex align-center"
          >
            <strong class="pr-1">{{ playlistsMapsCountInvalid() }}</strong>
            {{
              playlistsMapsCountInvalid() > 1
                ? "beatmaps inside some playlists are"
                : "beatmap inside a playlist is"
            }}
            invalid.
            <v-btn
              icon
              x-small
              class="ml-1"
              @click.stop="invalidPlaylistsMapsDialog = true"
            >
              <v-icon x-small>mdi-help</v-icon>
            </v-btn>
          </span>

          <span
            v-if="beatsaverBeatmapCountInvalid() > 0"
            class="grey--text d-flex align-center"
          >
            <strong class="pr-1">{{ beatsaverBeatmapCountInvalid() }}</strong>
            {{
              beatsaverBeatmapCountInvalid() > 1
                ? "beatsaver cached beatmaps are"
                : "beatsaver cached beatmap is"
            }}
            invalid.
            <v-btn
              icon
              x-small
              class="ml-1"
              @click.stop="invalidBeatsaverBeatmapDialog = true"
            >
              <v-icon x-small>mdi-help</v-icon>
            </v-btn>
          </span>

          <span v-if="lastScan()" class="grey--text">
            Last scan done the <strong>{{ lastScan() }}</strong>
          </span>
        </v-col>
      </v-row>
    </v-container>
    <ConfirmDialog
      :open.sync="confirmDialog"
      action-text="Clear"
      action-color="error"
      :on-action="clearCache"
    >
      <span
        >Are you sure you want to <strong class="error--text">clear</strong> the
        cache ?</span
      >
    </ConfirmDialog>
    <InvalidBeatmapDialog :open.sync="invalidBeatmapDialog" />
    <InvalidPlaylistDialog :open.sync="invalidPlaylistDialog" />
    <InvalidPlaylistsMapsDialog :open.sync="invalidPlaylistsMapsDialog" />
    <InvalidBeatsaverBeatmapDialog :open.sync="invalidBeatsaverBeatmapDialog" />
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import { get } from "vuex-pathify";
import BeatmapLibrary from "@/libraries/beatmap/BeatmapLibrary";
import ConfirmDialog from "@/components/dialogs/ConfirmDialog.vue";
import PlaylistLibrary from "@/libraries/playlist/PlaylistLibrary";
import InvalidBeatmapDialog from "@/components/dialogs/InvalidBeatmapDialog.vue";
import InvalidPlaylistDialog from "@/components/dialogs/InvalidPlaylistDialog.vue";
import ScannerService from "@/libraries/scanner/ScannerService";
import PlaylistMapsLibrary from "@/libraries/playlist/PlaylistMapsLibrary";
import InvalidPlaylistsMapsDialog from "@/components/dialogs/InvalidPlaylistsMapsDialog.vue";
import BeatsaverCachedLibrary from "@/libraries/beatmap/repo/BeatsaverCachedLibrary";
import InvalidBeatsaverBeatmapDialog from "@/components/dialogs/InvalidBeatsaverBeatmapDialog.vue";
import NotificationServiceScanner from "@/libraries/notification/NotificationServiceScanner";
import Tooltip from "@/components/helper/Tooltip.vue";
import ScanAllButton from "@/components/scanner/ScanAllButton.vue";

export default Vue.extend({
  name: "Library",
  components: {
    Tooltip,
    ConfirmDialog,
    InvalidBeatmapDialog,
    InvalidPlaylistDialog,
    InvalidPlaylistsMapsDialog,
    InvalidBeatsaverBeatmapDialog,
    ScanAllButton,
  },
  data: () => ({
    confirmDialog: false,
    invalidBeatmapDialog: false,
    invalidPlaylistDialog: false,
    invalidPlaylistsMapsDialog: false,
    invalidBeatsaverBeatmapDialog: false,
    isScanning: false,
    isRateLimited: false,
    rateLimitResetInSecond: 0,
  }),
  computed: {
    installationPathValid: get("settings/installationPathValid"),
    rateLimitResetDate: get<Date | undefined>("appState/beatsaverRateLimit"),
  },
  mounted(): void {
    ScannerService.onScanningStateUpdate(this.onScanningStateUpdate);
    setInterval(() => {
      this.isRateLimited = this.IsRateLimited();
      this.rateLimitResetInSecond = this.RateLimitResetIn();
    }, 1000);
  },
  beforeDestroy(): void {
    ScannerService.offScanningStateUpdate(this.onScanningStateUpdate);
  },
  methods: {
    beatmapsCountValid() {
      return BeatmapLibrary.GetAllValidMap().length;
    },
    beatmapsCountInvalid() {
      return BeatmapLibrary.GetAllInvalidMap().length;
    },
    playlistsCountValid() {
      return PlaylistLibrary.GetAllValidPlaylists().length;
    },
    playlistsCountInvalid() {
      return PlaylistLibrary.GetAllInvalidPlaylists().length;
    },
    playlistsMapsCountInvalid() {
      return PlaylistMapsLibrary.GetAllInvalidMapFlatten().length;
    },
    beatsaverBeatmapCountValid() {
      return BeatsaverCachedLibrary.GetAllValid().size;
    },
    beatsaverBeatmapCountInvalid() {
      return BeatsaverCachedLibrary.GetAllInvalid().size;
    },
    lastScan() {
      return BeatmapLibrary.GetLastScanDate()?.toLocaleString() ?? undefined;
    },
    onScanningStateUpdate() {
      this.isScanning = ScannerService.isScanning;
    },
    IsRateLimited() {
      if (this.rateLimitResetDate === undefined) return false;
      return this.rateLimitResetDate > new Date();
    },
    RateLimitResetIn() {
      if (this.rateLimitResetDate === undefined) return 0;
      return Math.ceil(
        (this.rateLimitResetDate.getTime() - new Date().getTime()) / 1000
      );
    },
    scan() {
      ScannerService.ScanAll();
      ScannerService.requestDialogToBeOpened();
      NotificationServiceScanner.notifyOnNextScan();
    },
    openConfirmDialogCache() {
      this.confirmDialog = true;
    },
    clearCache() {
      BeatmapLibrary.ClearCache();
      PlaylistLibrary.ClearCache();
      BeatsaverCachedLibrary.ClearCache();
    },
    canClearCache() {
      return (
        this.isScanning ||
        !this.installationPathValid ||
        (this.beatmapsCountValid() === 0 &&
          this.playlistsCountValid() === 0 &&
          this.beatmapsCountInvalid() === 0 &&
          this.playlistsCountInvalid() === 0)
      );
    },
  },
});
</script>
