<!--suppress ALL -->
<template>
  <v-container pa-0 ma-0>
    <v-btn :disabled="dialogScan || !installationPathValid" :loading="dialogScan" @click="scan()" color="primary">
      Scan now
    </v-btn>
    <v-btn :disabled="!songs" :loading="clearCacheTimeout" color="warning" @click="clearCache()" text>
      Clear cache
      <template v-slot:loader>
        <v-scroll-x-transition>
          <v-icon color="success">
            check
          </v-icon>
        </v-scroll-x-transition>
      </template>
    </v-btn>
    <v-dialog v-model="dialogScan" persistent width="300">
      <v-card>
        <v-list-item>
          <v-list-item-icon>
            <v-icon>search</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Scanning song</v-list-item-title>
            <v-list-item-subtitle>{{songScanner.songScanned}}/{{songScanner.totalNewSongsToScan}}</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
        <v-card-text>
          <v-progress-linear
                  v-model="scanPercent"
                  :indeterminate="songScanner.totalNewSongsToScan === -1"
                  class="mb-0">
          </v-progress-linear>
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-dialog v-model="dialogResult" persistent width="400">
      <v-card dark :color="scanResult.type">
        <v-list-item>
          <v-list-item-icon>
            <v-icon>{{scanResult.icon}}</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title v-html="scanResult.title"></v-list-item-title>
            <v-list-item-subtitle v-html="scanResult.subtitle"></v-list-item-subtitle>
          </v-list-item-content>
          <v-list-item-action>
            <v-btn text @click="dialogResult = false">Ok</v-btn>
          </v-list-item-action>
        </v-list-item>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
  import Vue from 'vue';
  import {get, sync} from 'vuex-pathify';
  import SongLoader from '@/lib/SongLoader';
  import BeatSaber from '@/lib/BeatSaber';
  import SongHashData from '../lib/SongHashData';
  import SongScanner from '@/lib/SongScanner';

  export default Vue.extend({
    name: 'BtnScan',
    data: () => ({
      dialogScan: false,
      dialogResult: false,
      scanResult: {
        type: '',
        message: '',
        err: undefined,
      },
      clearCacheTimeout: false,
      songScanner: new SongScanner(),
      scanPercent: 0,
    }),
    computed: {
      installationPath: get('settings/installationPath'),
      installationPathValid: get('settings/installationPathValid'),
      lastScan: sync('songs/lastScan'),
      songs: sync('songs/songs'),
      songScanned() {
        return this.songScanner.songScanned;
      }
    },
    methods: {
      getNumberOfSongs() {
        return this.songs !== undefined ? this.songs.filter((s) => s.valid).length : 0;
      },
      scan() {
        this.dialogScan = true;
        const instPath = this.installationPath;
        new BeatSaber(instPath).getSongList()
          .then(async (list) => {
            await this.songScanner.Scan();

            this.scanResult.type = 'success';
            this.scanResult.title = 'Done !';
            this.scanResult.subtitle = `Successfully imported <strong>${this.songScanner.totalNewSongsScanned}</strong> songs.`;
            this.scanResult.icon = 'check';

            if (this.getNumberOfSongs() === 0) {
              throw new Error('Something went wrong, 0 song were correctly imported');
            }
          })
          .catch((err) => {
            this.scanResult.type = 'error';
            this.scanResult.title = 'Failed to import song :(';
            this.scanResult.subtitle = err;
            this.scanResult.icon = 'close';
            throw err;
          })
          .finally(() => {
            this.dialogScan = false;
            this.dialogResult = true;

            setTimeout(() => {
              this.lastScan = new Date();
              this.songScanner = new SongScanner();
              this.scanPercent = 0;
            }, 150);
          });
      },
      clearCache() {
        this.songs = undefined;
        this.lastScan = undefined;
        this.clearCacheTimeout = true;
        setTimeout(() => this.clearCacheTimeout = false, 1500);
      },
    },
    watch: {
      songScanned() {
        this.scanPercent = (this.songScanner.songScanned/this.songScanner.totalNewSongsToScan) * 100;
      },
    },
  });
</script>

<style scoped>

</style>
