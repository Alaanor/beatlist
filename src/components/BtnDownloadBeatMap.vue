<template>
  <div>
    <v-btn icon :small="small" v-if="!isDownloaded"
           color="success" @click.stop="installBeatMap()"
           :loading="isDownloading || isExtracting"
           :disabled="isDownloading || isExtracting">
      <v-icon>file_download</v-icon>
      <template #loader>
        <v-progress-circular color="success" :rotate="-90"
                             :indeterminate="isExtracting"
                             :value="getPercent">
        </v-progress-circular>
      </template>
    </v-btn>
    <v-btn v-else icon :small="small" color="error"
           @click.stop="dialog = true">
      <v-icon>delete</v-icon>
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
    <v-snackbar v-model="errorSnackbar" color="error" :timeout="10000" bottom>
      <span class="body-2">Error: {{err}}</span>
      <v-btn dark text @click="errorSnackbar = false">Close</v-btn>
    </v-snackbar>
    <v-snackbar v-model="doneSnackbar" :timeout="5000" bottom @click.stop="">
      <v-list class="pa-0" style="background: none">
        <v-list-item class="pa-0">
          <v-list-item-avatar class="my-0">
            <SongCover :song="beatmap"></SongCover>
          </v-list-item-avatar>
          <v-list-item-content class="py-0">
            <v-list-item-title>{{beatmap.metadata.songName}}</v-list-item-title>
            <v-list-item-subtitle>The beatmap has successfully been downloaded.</v-list-item-subtitle>
          </v-list-item-content>
          <v-list-item-action class="my-0">
            <v-btn color="success" text @click.stop="doneSnackbar = false">Got it</v-btn>
          </v-list-item-action>
        </v-list-item>
      </v-list>
    </v-snackbar>
  </div>
</template>

<script>
  import Vue from 'vue';
  import SongLocal from '../lib/data/SongLocal';
  import SongCover from './SongCover';

  export default Vue.extend({
    name: 'BtnDownloadBeatMap',
    components: {SongCover},
    props: {
      beatmap: {type: Object, required: true},
      small: {type: Boolean, default: false},
    },
    data: () => ({
      dl: undefined,
      isDownloading: false,
      isExtracting: false,
      err: undefined,
      errorSnackbar: false,
      doneSnackbar: false,
      dialog: false,
    }),
    computed: {
      getPercent() {
        const percent = this.dl ? (this.dl.state.receivedBytes / this.dl.state.totalBytes) * 100 : 0;
        return isNaN(percent) ? 0 : percent;
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
      },
    },
    methods: {
      installBeatMap() {
        this.dl = this.beatmap.InstallIt();
        this.dl.on('downloaded', this.onDownloaded);
        this.dl.on('done', this.onDone);
        this.isDownloading = true;
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
        this.isExtracting = false;
        this.err = this.dl.err;
        if (this.err) {
          this.errorSnackbar = true;
        } else {
          this.doneSnackbar = true;
        }
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
      },
    },
  });
</script>

<style scoped>

</style>
