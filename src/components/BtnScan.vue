<template>
  <v-container pa-0 ma-0>
    <v-btn :disabled="dialogScan || !configValid" :loading="dialogScan" @click="scan()" color="primary">
      Scan now
    </v-btn>
    <v-dialog v-model="dialogScan" persistent width="300">
      <v-card dark>
        <v-card-text>
          Scanning song {{scanCount}}/{{scanAmount}}
          <v-progress-linear
                  v-model="scanPercent"
                  :indeterminate="scanAmount === -1"
                  class="mb-0">
          </v-progress-linear>
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-dialog v-model="dialogResult" persistent width="300">
      <v-card dark :color="scanResult.type">
        <v-card-title>
          <v-container ma-0 pa-0>
            <div class="subheading">{{scanResult.message}}</div>
            <div class="caption">{{scanResult.err}}</div>
          </v-container>
        </v-card-title>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn flat @click="dialogResult = false">Ok</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script lang="ts">
  import Vue from 'vue';
  import {get, sync} from 'vuex-pathify';
  import SongData from '@/lib/SongData';
  import BeatSaber from '@/lib/BeatSaber';

  export default Vue.extend({
    name: 'BtnScan',
    data: () => ({
      dialogScan: false,
      dialogResult: false,
      scanAmount: -1,
      scanCount: 0,
      scanPercent: 0,
      scanResult: {
        type: '',
        message: '',
        err: undefined,
      },
    }),
    computed: {
      installationPath: get('settings/installationPath'),
      configValid: get('settings/configValid'),
      lastScan: sync('songs/lastScan'),
      songs: sync('songs/songs'),
    },
    methods: {
      getNumberOfSongs(): number {
        const songs = this.songs as SongData[];
        return this.songs !== undefined ? songs.filter((s) => s.valid).length : 0;
      },
      scan() {
        this.dialogScan = true;
        const instPath = this.installationPath as string;
        new BeatSaber(instPath).getSongList()
          .then(async (list) => {
            this.scanAmount = list.length;
            this.songs = await Promise.all(list.map(async (songPath) => {
              const song = new SongData(songPath);
              await song.LoadInfo();
              this.scanCount++;
              if (this.scanCount % 100 === 0) { // dumb hack for smoother progress bar
                this.scanPercent = (this.scanCount / this.scanAmount) * 100;
              }
              return song;
            }));

            SongData.DetectDuplicate(this.songs as SongData[]);

            this.scanResult.type = 'success';
            this.scanResult.message = `Successfully imported ${this.getNumberOfSongs()} songs.`;
            this.scanResult.err = undefined;

            if (this.getNumberOfSongs() === 0) {
              throw new Error('Something went wrong, 0 song were correctly imported');
            }
        })
          .catch((err) => {
            this.scanResult.type = 'error';
            this.scanResult.message = 'Failed to import song :(';
            this.scanResult.err = err;
            throw err;
          })
          .finally(() => {
            this.dialogScan = false;
            this.dialogResult = true;

            setTimeout(() => {
              this.lastScan = new Date();
              this.scanAmount = -1;
              this.scanCount = 0;
              this.scanPercent = 0;
            }, 150);
          });
      },
    },
  });
</script>

<style scoped>

</style>
