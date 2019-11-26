<template>
  <div>
    <v-snackbar v-if="!!playlist" v-model="snackbar" :timeout="5000" bottom @click.stop="">
      <v-list class="pa-0" style="background: none">
        <v-list-item class="pa-0">
          <v-list-item-avatar class="my-0">
            <PlaylistCover :playlist="playlist"></PlaylistCover>
          </v-list-item-avatar>
          <v-list-item-content class="py-0">
            <v-list-item-title>{{playlist.playlistTitle}}</v-list-item-title>
            <v-list-item-subtitle>The playlist has successfully been downloaded.</v-list-item-subtitle>
          </v-list-item-content>
          <v-list-item-action class="my-0">
            <v-btn color="success" text @click.stop="snackbar = false">Got it</v-btn>
          </v-list-item-action>
        </v-list-item>
      </v-list>
    </v-snackbar>
  </div>
</template>

<script>
  import Vue from 'vue';
  import PlaylistCover from './PlaylistCover';
  import PlaylistOnline from '../lib/PlaylistOnline';

  export default Vue.extend({
    name: 'BackgroundSongDownloadNotifier',
    components: {PlaylistCover},
    data: () => ({
      playlist: undefined,
      snackbar: false,
    }),
    mounted() {
      PlaylistOnline.on('itemDone', this.itemDone);
    },
    methods: {
      itemDone(playlist) {
        this.playlist = playlist;
        this.snackbar = true;
      },
    },
  });
</script>

<style scoped>

</style>
