<template>
  <div v-if="!!playlist">
    <ListViewerForSongSimple :songs="playlist.songs" class="py-0">
      <template #actions="{item}">
        <BtnDownloadBeatMap v-if="IsOnlineSong(item)" :beatmap="item" download-only></BtnDownloadBeatMap>
        <v-btn icon class="text--secondary" @click="Remove(item)">
          <v-icon color="error">delete</v-icon>
        </v-btn>
      </template>
    </ListViewerForSongSimple>
    <v-container>
      <v-layout justify-center class="text--secondary">
        {{playlist.songs.length}} songs
      </v-layout>
    </v-container>
  </div>
</template>

<script>
  import Vue from 'vue';
  import {get} from 'vuex-pathify';
  import store from '@/store/store';
  import BtnDownloadBeatMap from '@/components/BtnDownloadBeatMap';
  import SongOnline from '@/lib/data/SongOnline';
  import ListViewerForSongSimple from '@/components/ListViewerForSongSimple';

  export default Vue.extend({
    name: 'PlaylistEditorSongsReader',
    props: {hash: {type: String, required: true}},
    components: {BtnDownloadBeatMap, ListViewerForSongSimple},
    computed: {
      playlist() {
        return this.playlists.find((p) => p.playlistHash === this.hash);
      },
      playlists: get('songs/playlists'),
    },
    methods: {
      Remove(song) {
        store.commit('songs/removeSongFromPlaylist', {playlist: this.playlist, song});
      },
      IsOnlineSong(song) {
        return SongOnline.isSongOnline(song);
      },
    },
  });
</script>

<style scoped>

</style>
