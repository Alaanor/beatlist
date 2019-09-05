<template>
  <v-snackbar v-model="snackbar" :timeout="2500">
    <span v-if="songAdded !== 0"><strong>{{songAdded}}</strong> new beatmap has been detected.</span>
    <span v-if="songRemoved !== 0"><strong>{{songRemoved}}</strong> beatmap {{songRemoved === 1 ? 'was' : 'were'}} automatically removed.</span>
    <v-btn text color="success" @click="snackbar = false">ok</v-btn>
  </v-snackbar>
</template>

<script>
  import Vue from 'vue';
  import {ipcRenderer} from 'electron';
  import {ON_WINDOW_SHOW} from '../lib/ipc/AutoScanSong';
  import SongScanner from '../lib/SongScanner';
  import SongLoader from '../lib/SongLoader';

  export default Vue.extend({
    name: 'AutoScanSong',
    data: () => ({
      snackbar: false,
      songAdded: 0,
      songRemoved: 0,
    }),
    methods: {
      async onWindowShow() {
        if (await SongLoader.NewSongAvailable()) {
          const scanner = new SongScanner();
          await scanner.Scan();
          this.songAdded = scanner.songAdded;
          this.songRemoved = scanner.songRemoved;
          this.snackbar = true;
        }
      },
    },
    mounted() {
      ipcRenderer.on(ON_WINDOW_SHOW, this.onWindowShow);
    },
  });
</script>

<style scoped>

</style>
