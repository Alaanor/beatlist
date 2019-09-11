<template>
  <div v-if="!!playlist">
    <v-card>
      <v-list class="py-0">
        <template v-for="(song, i) in playlist.songs">
          <v-divider v-if="i !== 0"></v-divider>
          <v-list-item>
            <v-list-item-avatar>
              <SongCover :song="song"></SongCover>
            </v-list-item-avatar>
            <v-list-item-content>
              <v-list-item-title>{{song.metadata.songName}}</v-list-item-title>
              <v-list-item-subtitle>
                <span class="text--primary">{{song.metadata.songAuthorName}}</span> -
                {{song.metadata.levelAuthorName}}
              </v-list-item-subtitle>
            </v-list-item-content>
            <v-list-item-action class="d-flex flex-row">
              <BtnDownloadBeatMap v-if="IsOnlineSong(song)" :beatmap="song" download-only></BtnDownloadBeatMap>
              <v-btn icon class="text--secondary" @click="Remove(song)">
                <v-icon color="error">delete</v-icon>
              </v-btn>
            </v-list-item-action>
          </v-list-item>
        </template>
      </v-list>
    </v-card>
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
  import SongCover from './SongCover';
  import store from '@/store/store';
  import BtnDownloadBeatMap from '@/components/BtnDownloadBeatMap';
  import SongOnline from '@/lib/data/SongOnline';

  export default Vue.extend({
    name: 'PlaylistEditorSongsReader',
    props: {hash: {type: String, required: true}},
    components: {SongCover, BtnDownloadBeatMap},
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
