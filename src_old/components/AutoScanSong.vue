<template>
  <v-snackbar v-model="snackbar" :timeout="7500">
    <span v-if="songAdded !== 0"><strong>{{songAdded}}</strong> new beatmap has been detected.</span>
    <span v-if="songRemoved !== 0"><strong>{{songRemoved}}</strong> beatmap {{songRemoved === 1 ? 'was' : 'were'}} automatically removed.</span>
    <v-btn text color="success" @click="snackbar = false">ok</v-btn>
  </v-snackbar>
</template>

<script>
  import Vue from 'vue';
  import {ipcRenderer} from 'electron';
  import {ON_AUTO_SCAN_COMPONENT_READY, ON_WINDOW_SHOW} from '../lib/ipc/AutoScanSong';
  import SongScanner from '../lib/SongScanner';
  import SongLoader from '../lib/SongLoader';
  import {get} from 'vuex-pathify';

  export default Vue.extend({
    name: 'AutoScanSong',
    data: () => ({
      snackbar: false,
      songAdded: 0,
      songRemoved: 0,
    }),
    computed: {
      configValid: get('settings/configValid'),
    },
    methods: {
      async onWindowShow() {
        if (!this.configValid) {
          return;
        }

        if (await SongLoader.NewSongAvailable()) {
          const scanner = new SongScanner();
          await scanner.Scan();

          this.songAdded = scanner.songAdded;
          this.songRemoved = scanner.songRemoved;

          if (this.songAdded !== 0 || this.songRemoved !== 0) {
            this.snackbar = true;
          }
        }
      },
    },
    mounted() {
      ipcRenderer.on(ON_WINDOW_SHOW, this.onWindowShow);
      ipcRenderer.send(ON_AUTO_SCAN_COMPONENT_READY);
    },
  });
</script>

<style scoped>

</style>
