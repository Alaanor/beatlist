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
            :disabled="isScanning || !installationPathValid"
            :loading="isScanning"
            color="success"
            class="my-2"
            @click="scan()"
          >
            Update library
          </v-btn>
          <v-btn
            :disabled="isScanning || !installationPathValid || beatmapsCountValid === 0"
            color="warning"
            class="my-2"
            @click="openConfirmDialogCache()"
          >
            Clear cache
          </v-btn>
        </v-col>
        <v-col class="d-flex justify-center align-start flex-column py-0">
          <span>
            <strong>{{ beatmapsCountValid }}</strong>
            {{ beatmapsCountValid > 1 ? 'beatmaps are' : 'beatmap is' }} loaded.
          </span>
          <span>
            <strong>{{ playlistsCountValid }}</strong>
            {{ beatmapsCountValid > 1 ? 'playlists are' : 'playlist is' }} loaded.
          </span>
          <span class="py-1"/>
          <span
            v-if="beatmapsCountInvalid > 0"
            class="grey--text d-flex align-center"
          >
            <strong class="pr-1">{{ beatmapsCountInvalid }}</strong>
            {{ beatmapsCountValid > 1 ? 'beatmaps are' : 'beatmap is' }} invalid.
            <v-btn
              icon
              x-small
              class="ml-1"
              @click="invalidBeatmapDialog = true"
            >
              <v-icon x-small>mdi-help</v-icon>
            </v-btn>
          </span>
          <span
            v-if="playlistsCountInvalid > 0"
            class="grey--text d-flex align-center"
          >
            <strong class="pr-1">{{ playlistsCountInvalid }}</strong>
            {{ playlistsCountInvalid > 1 ? 'playlists are' : 'playlist is' }} invalid.
            <v-btn
              icon
              x-small
              class="ml-1"
              @click="invalidPlaylistDialog = true"
            >
              <v-icon x-small>mdi-help</v-icon>
            </v-btn>
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
    <ConfirmDialog
      :open.sync="confirmDialog"
      action-text="Clear"
      action-color="error"
      :on-action="clearCache"
    >
      <span>Are you sure you want to <strong class="error--text">clear</strong> the cache ?</span>
    </ConfirmDialog>
    <InvalidBeatmapDialog :open.sync="invalidBeatmapDialog"/>
    <InvalidPlaylistDialog :open.sync="invalidPlaylistDialog"/>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue';
import { get } from 'vuex-pathify';
import BeatmapLibrary from '@/libraries/beatmap/BeatmapLibrary';
import ConfirmDialog from '@/components/dialogs/ConfirmDialog.vue';
import PlaylistLibrary from '@/libraries/playlist/PlaylistLibrary';
import InvalidBeatmapDialog from '@/components/dialogs/InvalidBeatmapDialog.vue';
import InvalidPlaylistDialog from '@/components/dialogs/InvalidPlaylistDialog.vue';
import ScannerService from '@/libraries/scanner/ScannerService';

export default Vue.extend({
  name: 'SongLibrary',
  components: {
    ConfirmDialog, InvalidBeatmapDialog, InvalidPlaylistDialog,
  },
  data: () => ({
    confirmDialog: false,
    invalidBeatmapDialog: false,
    invalidPlaylistDialog: false,
  }),
  computed: {
    installationPathValid: get('settings/installationPathValid'),
    beatmapsCountValid: () => BeatmapLibrary.GetAllValidMap().length,
    beatmapsCountInvalid: () => BeatmapLibrary.GetAllInvalidMap().length,
    playlistsCountValid: () => PlaylistLibrary.GetAllValidPlaylists().length,
    playlistsCountInvalid: () => PlaylistLibrary.GetAllInvalidPlaylists().length,
    lastScan: () => BeatmapLibrary.GetLastScanDate()?.toLocaleString() ?? undefined,
    isScanning: () => ScannerService.isScanning,
  },
  methods: {
    scan() {
      ScannerService.ScanAll();
      ScannerService.requestDialogToBeOpened();
    },
    openConfirmDialogCache() {
      this.confirmDialog = true;
    },
    clearCache() {
      BeatmapLibrary.ClearCache();
      PlaylistLibrary.ClearCache();
    },
  },
});
</script>

<style scoped>

</style>
