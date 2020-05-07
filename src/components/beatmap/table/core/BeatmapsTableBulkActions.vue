<template>
  <div style="height: 52px;">
    <v-slide-x-transition>
      <v-container v-if="selected.length > 0" class="d-flex align-center ml-n4">
        <v-btn
          v-if="bulkAdd && playlist"
          outlined
          small
          color="success"
          class="ml-4"
          :loading="bulkAddLoading"
          @click="performBulkAdd"
        >
          Add
        </v-btn>

        <v-btn
          v-if="bulkRemove && playlist"
          outlined
          small
          color="error"
          class="ml-4"
          :loading="bulkRemoveLoading"
          @click="performBulkRemove"
        >
          Remove
        </v-btn>

        <v-btn
          v-if="bulkDownload"
          outlined
          small
          color="success"
          class="ml-4"
          :loading="bulkDownloadLoading"
          @click="performBulkDownload"
        >
          Download
        </v-btn>

        <span class="pl-3">
          {{ selected.length }} item{{ selected.length > 1 ? "s" : "" }}
          selected
        </span>
      </v-container>
    </v-slide-x-transition>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from "vue";
import { BeatsaverBeatmap } from "@/libraries/net/beatsaver/BeatsaverBeatmap";
import PlaylistOperation from "@/libraries/playlist/PlaylistOperation";
import { PlaylistLocal } from "@/libraries/playlist/PlaylistLocal";
import BeatmapInstaller from "@/libraries/os/beatSaber/installer/BeatmapInstaller";
import NotificationService from "@/libraries/notification/NotificationService";
import BeatmapLibrary from "@/libraries/beatmap/BeatmapLibrary";

export default Vue.extend({
  name: "BeatmapsTableBulkActions",
  props: {
    selected: { type: Array as PropType<BeatsaverBeatmap[]>, required: true },
    playlist: {
      type: Object as PropType<PlaylistLocal | undefined>,
      default: undefined,
    },
    bulkAdd: { type: Boolean, default: false },
    bulkRemove: { type: Boolean, default: false },
    bulkDownload: { type: Boolean, default: false },
  },
  data: () => ({
    bulkAddLoading: false,
    bulkRemoveLoading: false,
    bulkDownloadLoading: false,
  }),
  methods: {
    performBulkAdd() {
      if (!this.playlist) return;

      this.bulkAddLoading = true;

      PlaylistOperation.BulkAddMapInPlaylist(
        this.playlist,
        this.selected.map((s) => s.hash)
      ).finally(() => {
        this.bulkAddLoading = false;
        this.$emit("onDone");
      });
    },
    performBulkRemove() {
      if (!this.playlist) return;

      this.bulkRemoveLoading = true;

      PlaylistOperation.BulkRemoveMapFromPlaylist(
        this.playlist,
        this.selected.map((s) => s.hash)
      ).finally(() => {
        this.bulkRemoveLoading = false;
        this.$emit("onDone");
      });
    },
    performBulkDownload() {
      this.bulkDownloadLoading = true;

      this.selected.forEach((beatmap: BeatsaverBeatmap) => {
        if (BeatmapLibrary.GetMapByHash(beatmap.hash) === undefined) {
          BeatmapInstaller.Install(beatmap, (operation) =>
            NotificationService.NotifyBeatmapDownload(operation.result)
          );
        }
      });
    },
  },
});
</script>

<style scoped></style>
