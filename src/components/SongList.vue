<template>
  <v-container>
    <v-container>
      <v-layout align-start justify-space-between>
        <v-flex>
          <h1>Song list</h1>
        </v-flex>
        <v-flex>
          <v-text-field v-model="search" label="search" solo append-icon="search"></v-text-field>
        </v-flex>
      </v-layout>
    </v-container>
    <br/>
    <v-container fluid grid-list-lg>
      <v-layout row wrap align-center justify-center>
        <v-flex v-for="song in filtered">
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
  import store from '@/store/store';
  import Song from '@/components/Song.vue';

  interface SongList {
    list: string[];
    err: Error | undefined;
  }

  export default Vue.extend({
    name: 'SongList',
    components: {Song},
    data: () => ({
      songs: {list: [], err: undefined} as SongList,
      search: '',
    }),
    computed: {
      filtered() {
        return this.songs.list;
      },
    },
    created() {
      new BeatSaber(this.$store.state.installationPath).getSongList()
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
