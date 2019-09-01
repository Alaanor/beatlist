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
        this.dl.on('update', this.onUpdate);
        this.dl.on('downloaded', this.onDownloaded);
        this.dl.on('extracted', this.onExtracted);
        this.isDownloading = true;
      },
      onUpdate() {
        //console.log(this.dl.state);
      },
      onDownloaded() {
        this.isDownloading = false;
        this.isExtracting = true;
      },
      onExtracted() {

      },
    }
  });
</script>

<style scoped>

</style>
