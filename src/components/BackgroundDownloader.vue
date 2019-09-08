<template>
  <div>
    <div v-for="item in dl">
      <v-snackbar v-if="!!item" v-model="item.errorSnackbar" color="error" :timeout="10000" bottom>
        <span class="body-2">Error: {{item.err}}</span>
        <v-btn dark text @click="item.errorSnackbar = false">Close</v-btn>
      </v-snackbar>
      <v-snackbar v-if="!!item" v-model="item.doneSnackbar" :timeout="5000" bottom @click.stop="">
        <v-list class="pa-0" style="background: none">
          <v-list-item class="pa-0">
            <v-list-item-avatar class="my-0">
              <SongCover :song="item.localBeatMap"></SongCover>
            </v-list-item-avatar>
            <v-list-item-content class="py-0">
              <v-list-item-title>{{item.beatmap.metadata.songName}}</v-list-item-title>
              <v-list-item-subtitle>The beatmap has successfully been downloaded.</v-list-item-subtitle>
            </v-list-item-content>
            <v-list-item-action class="my-0">
              <v-btn color="success" text @click.stop="item.doneSnackbar = false">Got it</v-btn>
            </v-list-item-action>
          </v-list-item>
        </v-list>
      </v-snackbar>
    </div>
  </div>
</template>

<script>
  import Vue from 'vue';
  import DownloadBeatMapItem from '../lib/DownloadBeatMapItem';
  import SongLocal from '@/lib/data/SongLocal';
  import SongCover from './SongCover';

  const timeout = 15000;

  export default Vue.extend({
    name: 'BackgroundDownloader',
    components: {SongCover},
    data: () => ({
      dl: {},
    }),
    mounted() {
      DownloadBeatMapItem.on('itemDone', this.itemDone)
    },
    methods: {
      itemDone(dl) {
        this.$set(this.dl, dl.beatmap.key, {
          beatmap: dl.beatmap,
          localBeatMap: SongLocal.get(dl.beatmap),
          doneSnackbar: !!dl.err ? undefined : true,
          errorSnackbar: !!dl.err ? true : undefined,
          err: dl.err,
        });

        setTimeout(() => {
          this.$set(this.dl, dl.beatmap.key, undefined);
        }, timeout)
      },
    }
  })
</script>

<style scoped>

</style>
