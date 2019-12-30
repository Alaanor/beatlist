<template>
  <v-container>
    <p class="display-1">
      Library
    </p>
    <v-container>
      <v-row>
        <v-col
          cols="auto"
          class="d-flex align-center justify-center flex-column py-0"
        >
          <v-btn
            :disabled="scanning.global || !installationPathValid"
            :loading="scanning.global"
            color="success"
            class="my-2"
            @click="scan()"
          >
            Update library
          </v-btn>
          <v-btn
            :disabled="scanning.global || !installationPathValid || beatmapsCountValid === 0"
            color="warning"
            class="my-2"
            @click="openConfirmDialogCache()"
          >
            Clear cache
          </v-btn>
        </v-col>
        <v-col class="d-flex justify-center align-start flex-column">
          <span>
            <strong>{{ beatmapsCountValid }}</strong>
            {{ beatmapsCountValid > 1 ? 'beatmaps are' : 'beatmap is' }} in the library.
          </span>
          <span>
            <strong>{{ playlistsCount }}</strong>
            {{ beatmapsCountValid > 1 ? 'playlists are' : 'playlist is' }} in the library.
          </span>
          <span class="py-1"/>
          <span
            v-if="beatmapsCountInvalid > 0"
            class="grey--text"
          >
            <strong>{{ beatmapsCountInvalid }}</strong>
            {{ beatmapsCountValid > 1 ? 'beatmaps are' : 'beatmap is' }} invalid.
          </span>
          <span
            v-if="lastScan"
            class="grey--text"
          >
            Last scan done the <strong>{{ lastScan }}</strong>
          </span>
        </v-col>
      </v-row>
    </v-container>
    <LoaderDialog
      v-model="scanning.beatmap"
      icon="search"
      text="Scanning beatmap"
      color="success"
      :progress="progress.beatmap"
    />
    <LoaderDialog
      v-model="scanning.playlist"
      icon="search"
      text="Scanning playlist"
      color="success"
      :progress="progress.playlist"
    />
    <ConfirmDialog
      :open.sync="confirmDialog"
      action-text="Clear"
      action-color="error"
      :on-action="clearCache"
    >
      <span>Are you sure you want to <strong class="error--text">clear</strong> the cache ?</span>
    </ConfirmDialog>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue';
import { get } from 'vuex-pathify';
import BeatmapScanner from '@/libraries/beatmap/BeatmapScanner';
import BeatmapLibrary from '@/libraries/beatmap/BeatmapLibrary';
import LoaderDialog from '@/components/dialogs/LoaderDialog.vue';
import ConfirmDialog from '@/components/dialogs/ConfirmDialog.vue';
import Progress from '@/libraries/common/Progress';
import PlaylistScanner from '@/libraries/playlist/PlaylistScanner';
import ProgressGroup from '@/libraries/common/ProgressGroup';
import PlaylistLibrary from '@/libraries/playlist/PlaylistLibrary';

export default Vue.extend({
  name: 'SongLibrary',
  components: { LoaderDialog, ConfirmDialog },
  data: () => ({
    scanning: { global: false, beatmap: false, playlist: false },
    beatmapScanner: {} as BeatmapScanner,
    playlistScanner: {} as PlaylistScanner,
    confirmDialog: false,
    progress: { beatmap: new Progress(), playlist: new ProgressGroup() },
  }),
  computed: {
    installationPathValid: get('settings/installationPathValid'),
    beatmapsCountValid: () => BeatmapLibrary.GetAllValidMap().length,
    beatmapsCountInvalid: () => BeatmapLibrary.GetAllInvalidMap().length,
    playlistsCount: () => PlaylistLibrary.GetAllPlaylists().length,
    lastScan: () => BeatmapLibrary.GetLastScanDate()?.toLocaleString() ?? undefined,
  },
  methods: {
    scan() {
      this.progress = { beatmap: new Progress(), playlist: new ProgressGroup() };

      this.scanning.global = true;
      this.scanning.beatmap = true;
      this.scanning.playlist = false;

      this.playlistScanner = new PlaylistScanner();
      this.beatmapScanner = new BeatmapScanner();

      this.beatmapScanner.ScanAll(this.progress.beatmap)
        .then(() => {
          setTimeout(() => {
            this.scanning.beatmap = false;
          }, 200);

          this.scanning.playlist = true;
          return this.playlistScanner.ScanAll(this.progress.playlist);
        })
        .then(() => {
          setTimeout(() => {
            this.scanning.playlist = false;
            this.scanning.global = false;
          });
        })
        .catch((e: Error) => {
          this.scanning.beatmap = false;
          this.scanning.playlist = false;
          this.scanning.global = false;

          console.error(e);
        });
    },
    openConfirmDialogCache() {
      this.confirmDialog = true;
    },
    clearCache() {
      BeatmapLibrary.ClearCache();
    },
  },
});
</script>

<style scoped>

</style>
