<template>
  <v-container>
    <h1>Song list</h1>
    <br/>
    <v-container fluid grid-list-lg>
      <v-layout row wrap align-center justify-center>
        <v-flex v-for="song in songs.list">
          <Song :songPath="song"></Song>
        </v-flex>
      </v-layout>
    </v-container>
    <v-alert :value="true" type="error" v-if="songs.err !== undefined">
      <v-container class="ma-0 pa-0">
        <v-layout align-center justify-space-between row fill-height>
          <span>Couldn't find any song, you probably haven't specified the right folder in <b>Settings</b>.</span>
          <v-btn icon to="settings" class="pa-0 ma-0">
            <v-icon>launch</v-icon>
          </v-btn>
        </v-layout>
      </v-container>
    </v-alert>
  </v-container>
</template>

<script lang="ts">
  import Vue from 'vue';
  import BeatSaber from '@/lib/BeatSaber';
  import store from '@/store';
  import Song from '@/components/Song.vue';

  interface SongList {
    list: string[];
    err: Error | undefined;
  }

  export default Vue.extend({
    name: 'SongList',
    components: { Song },
    data: () => ({
      songs: {list: [], err: undefined} as SongList,
    }),
    created() {
      new BeatSaber(store.state.installationPath).getSongList()
        .then((list) => {
          this.songs.list = list;
          this.songs.err = undefined;
        })
        .catch((err) => {
          this.songs.list = [];
          this.songs.err = err;
        });
    },
  });
</script>

<style scoped>

</style>
