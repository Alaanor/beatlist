<template>
  <v-container>
    <p class="display-1">
      Song library
    </p>
    <v-container>
      <v-row>
        <v-col
          cols="auto"
          class="d-flex align-center justify-center flex-column"
        >
          <v-btn
            :disabled="scanning || !installationPathValid"
            :loading="scanning"
            color="success"
            class="my-2"
            @click="scan()"
          >
            Update library
          </v-btn>
          <v-btn
            :disabled="scanning || !installationPathValid || songAvailable === 0"
            color="warning"
            class="my-2"
            @click="openConfirmDialogCache()"
          >
            Clear cache
          </v-btn>
        </v-col>
        <v-col class="d-flex justify-center align-start flex-column">
          <span>
            <strong>{{ songAvailable }}</strong>
            {{ songAvailable > 1 ? 'beatmaps' : 'beatmap' }} in the library.
          </span>
          <span v-if="lastScan">
            Last scan: {{ lastScan }}
          </span>
        </v-col>
      </v-row>
    </v-container>
    <LoaderDialog v-model="scanning"/>
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
import BeatmapScanner from '../../libraries/beatmap/BeatmapScanner';
import BeatmapLibrary from '../../libraries/beatmap/BeatmapLibrary';
import LoaderDialog from '../../components/dialogs/LoaderDialog.vue';
import ConfirmDialog from '../../components/dialogs/ConfirmDialog.vue';

export default Vue.extend({
  name: 'SongLibrary',
  components: { LoaderDialog, ConfirmDialog },
  data: () => ({
    scanning: false,
    scanner: {} as BeatmapScanner,
    confirmDialog: false,
  }),
  computed: {
    installationPathValid: get('settings/installationPathValid'),
    songAvailable: () => BeatmapLibrary.GetAllMaps().length,
    lastScan: () => BeatmapLibrary.GetLastScan()?.toLocaleString() ?? undefined,
  },
  methods: {
    scan() {
      this.scanning = true;
      this.scanner = new BeatmapScanner();
      this.scanner.ScanAll()
        .then(() => {
          this.scanning = false;
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
