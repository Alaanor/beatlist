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
            @click="clearCache()"
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
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue';
import { get } from 'vuex-pathify';
import BeatmapScanner from '../../libraries/beatmap/BeatmapScanner';
import BeatmapLibrary from '../../libraries/beatmap/BeatmapLibrary';

export default Vue.extend({
  name: 'SongLibrary',
  data: () => ({
    scanning: false,
    scanner: {} as BeatmapScanner,
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
    clearCache() {
      BeatmapLibrary.ClearCache();
    },
  },
});
</script>

<style scoped>

</style>
