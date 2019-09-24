<template>
  <div>
    <v-btn icon :small="small" v-if="!isDownloaded"
           color="success" @click.stop="installBeatMap()"
           :loading="isDownloading || isExtracting"
           :disabled="isDownloading || isExtracting">
      <v-icon>file_download</v-icon>
      <template #loader>
        <v-progress-circular
                color="success" :rotate="-90" :value="getPercent"
                :indeterminate="isExtracting">
        </v-progress-circular>
      </template>
    </v-btn>
    <v-btn v-else-if="!downloadOnly" icon :small="small" color="error"
           @click.stop="dialog = true">
      <v-icon>delete</v-icon>
    </v-btn>
    <v-btn v-else-if="showTickIfDownloaded" icon :small="small" disabled>
      <v-icon>check</v-icon>
    </v-btn>
    <v-dialog v-if="isDownloaded" v-model="dialog" max-width="500px">
      <v-card>
        <v-card-title class="headline">Confirm</v-card-title>
        <v-card-text>
          <p class="body-1 font-weight-light">Are you sure you want to delete
            <strong>{{beatmap.metadata.songName}}</strong> ?</p>
          <p class="caption font-weight-light">This operation will delete the following folder: <span
                  class="font-italic">{{songPath}}</span></p>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text color="grey" @click="dialog = false">Cancel</v-btn>
          <v-btn color="error" @click="deleteBeatMap()">Delete</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
  import Vue from 'vue';
  import SongLocal from '../lib/data/SongLocal';
  import DownloadBeatMapItem from '@/lib/DownloadBeatMapItem';

  export default Vue.extend({
    name: 'BtnDownloadBeatMap',
    props: {
      beatmap: {type: Object, required: true},
      small: {type: Boolean, default: false},
      downloadOnly: {type: Boolean, default: false},
      showTickIfDownloaded: {type: Boolean, default: false},
    },
    data: () => ({
      dl: undefined,
      isDownloading: false,
      isExtracting: false,
      err: undefined,
      dialog: false,
    }),
    computed: {
      getPercent() {
        const percent = this.dl ? ((this.dl.state.receivedBytes / this.dl.state.totalBytes) * 100)  : 0;
        const easeOutExpo = 100 * (-Math.pow(2, -(1/10) * percent) + 1);
        console.log(easeOutExpo);
        return isNaN(easeOutExpo) ? 0 : easeOutExpo;
      },
      isDownloaded() {
        return SongLocal.isInLibrary(this.beatmap);
      },
      songPath() {
        return SongLocal.get(this.beatmap).path;
      },
    },
    watch: {
      beatmap() {
        this.reset();
        DownloadBeatMapItem.on(this.beatmap.key, this.reset);
      },
    },
    mounted() {
      DownloadBeatMapItem.on(this.beatmap.key, this.reset);
    },
    methods: {
      installBeatMap() {
        this.dl = this.beatmap.InstallIt();
        this.isDownloading = true;
        this.isExtracting = false;
        this.subscribeDlEvent();
      },
      subscribeDlEvent() {
        this.dl.on('downloaded', this.onDownloaded);
        this.dl.on('done', this.onDone);
      },
      deleteBeatMap() {
        this.beatmap.deleteIt();
        this.dialog = false;
      },
      onDownloaded() {
        this.isDownloading = false;
        this.isExtracting = true;
      },
      onDone() {
        this.isDownloading = false;
        this.isExtracting = false;
        this.err = this.dl.err;
      },
      reset() {
        if (this.dl) {
          this.dl.off('downloaded', this.onDownloaded);
          this.dl.off('done', this.onDone);
          this.dl = undefined;
        }

        this.isDownloading = true;
        this.isDownloading = false;
        this.isExtracting = false;
        this.err = undefined;

        this.checkForOnGoingDl();
      },
      checkForOnGoingDl() {
        if (DownloadBeatMapItem.IsDownloading(this.beatmap)) {
          this.dl = DownloadBeatMapItem.GetFor(this.beatmap);
          this.subscribeDlEvent();

          if (this.dl.state.receivedBytes === this.dl.state.totalBytes) {
            this.isExtracting = true;
          } else {
            this.isDownloading = true;
          }
        }
      },
    },
  });
</script>

<style scoped>

</style>
