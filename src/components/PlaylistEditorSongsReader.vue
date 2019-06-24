<template>
  <div v-if="!!playlist">
    <v-card>
      <v-list class="py-0">
        <template v-for="(song, i) in playlist.songs">
          <v-divider v-if="i !== 0"></v-divider>
          <v-list-tile>
            <v-list-tile-avatar>
              <SongCover :song="song"></SongCover>
            </v-list-tile-avatar>
            <v-list-tile-content>
              <v-list-tile-title>{{song.songName}}</v-list-tile-title>
              <v-list-tile-sub-title><span class="text--primary">{{song.songAuthorName}}</span> -
                {{song.levelAuthorName}}
              </v-list-tile-sub-title>
            </v-list-tile-content>
            <v-list-tile-action>
              <v-btn icon class="text--secondary">
                <v-icon>delete</v-icon>
              </v-btn>
            </v-list-tile-action>
          </v-list-tile>
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

  export default Vue.extend({
    name: 'PlaylistEditorSongsReader',
    props: {hash: {type: String, required: true}},
    components: {SongCover},
    computed: {
      playlist() {
        return this.playlists.find((p) => p.playlistHash === this.hash);
      },
      playlists: get('songs/playlists'),
    },
  });
</script>

<style scoped>

</style>
