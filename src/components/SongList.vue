<template>
  <v-container>
    <h1>Song list</h1>
    <br/>
    <div v-for="song in songs.list">
      <p>{{song}}</p>
    </div>
    <p class="red" v-if="songs.err !== undefined">{{songs.err}}</p>
  </v-container>
</template>

<script lang="ts">
  import Vue from 'vue';
  import BeatSaber from '@/lib/BeatSaber';
  import store from '@/store';

  interface SongList {
    list: string[];
    err: Error | undefined;
  }

  export default Vue.extend({
    name: 'SongList',
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
