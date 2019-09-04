<template>
  <div>
    <v-btn icon :small="small"
           color="success"
           @click.stop="installBeatMap()"
           :loading="isDownloading || isExtracting"
           :disabled="isDownloading || isExtracting || isDownloaded">
      <v-icon>{{isDownloaded ? 'done' : 'file_download'}}</v-icon>
      <template #loader>
        <v-progress-circular color="success" :rotate="-90"
                             :indeterminate="isExtracting"
                             :value="getPercent">
        </v-progress-circular>
      </template>
    </v-btn>
    <v-snackbar v-model="snackbar" color="error" :timeout="5000" bottom>
      <span class="body-2">Error: {{err}}</span>
      <v-btn dark text @click="snackbar = false">Close</v-btn>
    </v-snackbar>
  </div>
</template>

<script>
  import Vue from 'vue';
  import SongLocal from '../lib/data/SongLocal';

  // @TODO what if I paginated and went back during a donwload
  // @TODO show completed download/song I already got
  export default Vue.extend({
    name: 'BtnDownloadBeatMap',
    props: {
      beatmap: {type: Object, required: true},
      small: {type: Boolean, default: false},
    },
    data: () => ({
      dl: undefined,
      isDownloading: false,
      isExtracting: false,
      err: undefined,
      snackbar: false,
    }),
    computed: {
      getPercent() {
        const percent = this.dl ? (this.dl.state.receivedBytes / this.dl.state.totalBytes) * 100 : 0;
        return isNaN(percent) ? 0 : percent;
      },
      isDownloaded() {
        return SongLocal.isInLibrary(this.beatmap);
      }
    },
    watch: {
      beatmap() {
        this.reset();
      },
    },
    methods: {
      installBeatMap() {
        this.dl = this.beatmap.InstallIt();
        this.dl.on('downloaded', this.onDownloaded);
        this.dl.on('extracted', this.onExtracted);
        this.dl.on('done', this.onDone);
        this.isDownloading = true;
      },
      onDownloaded() {
        this.isDownloading = false;
        this.isExtracting = true;
      },
      onExtracted() {
        this.isExtracting = false;
      },
      onDone() {
        this.err = this.dl.err;
        if (this.err) {
          this.snackbar = true;
        }
      },
      reset() {
        if (this.dl) {
          this.dl.off('downloaded', this.onDownloaded);
          this.dl.off('extracted', this.onExtracted);
          this.dl.off('done', this.onDone);
          this.dl = undefined;
        }

        this.isDownloading = true;
        this.isDownloading = false;
        this.isExtracting = false;
        this.err = undefined;
      },
    },
  });
</script>

<style scoped>

</style>
