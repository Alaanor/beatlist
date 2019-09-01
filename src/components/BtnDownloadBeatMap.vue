<template>
  <v-btn icon :small="small"
         color="success"
         @click.stop="installBeatMap()"
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
</template>

<script>
  import Vue from 'vue';

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
    }),
    computed: {
      getPercent() {
        let percent = this.dl ? (this.dl.state.receivedBytes / this.dl.state.totalBytes) * 100 : 0;
        return isNaN(percent) ? 0 : percent;
      }
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
        this.err = this.dl.err; // @TODO ui to show the error in case
      },
    }
  });
</script>

<style scoped>

</style>
