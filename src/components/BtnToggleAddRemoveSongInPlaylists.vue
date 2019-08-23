<!--suppress XmlUnboundNsPrefix -->
<template>
  <v-dialog v-model="dialog" scrollable max-width="450px">
    <template v-slot:activator="{ on }">
      <slot>
        <v-btn v-if="icon" v-on="on" icon>
          <v-icon>{{value || "add"}}</v-icon>
        </v-btn>
        <v-btn v-else flat small pa-0 v-on="on">
          {{value || "Add"}}
        </v-btn>
      </slot>
    </template>
    <v-card v-if="playlists">
      <v-card-title class="subheading">
        Select playlist
        <v-spacer></v-spacer>
        <v-btn icon @click="dialog = false" small class="ma-0">
          <v-icon>close</v-icon>
        </v-btn>
      </v-card-title>
      <v-divider></v-divider>
      <v-card-text style="max-height: 350px;">
        <v-card elevation="10">
          <v-list class="py-0">
            <template v-for="(playlist, i) in playlists">
              <v-divider v-if="i !== 0"></v-divider>
              <v-list-tile>
                <v-list-tile-action>
                  <v-btn icon @click="!IsInPlaylist(playlist)?Add(playlist):Remove(playlist)">
                    <v-icon :color="!IsInPlaylist(playlist)?'success':'error'">
                      {{!IsInPlaylist(playlist)?'add':'remove'}}
                    </v-icon>
                  </v-btn>
                </v-list-tile-action>
                <v-list-tile-title>
                  {{playlist.playlistTitle}}
                </v-list-tile-title>
                <v-spacer></v-spacer>
                <v-list-tile-avatar class="pl-3">
                  <PlaylistCover :playlist="playlist"></PlaylistCover>
                </v-list-tile-avatar>
              </v-list-tile>
            </template>
          </v-list>
        </v-card>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
  import Vue from 'vue';
  import {get} from 'vuex-pathify';
  import store from '@/store/store';
  import PlaylistCover from '@/components/PlaylistCover.vue';
  import SongLoader from '@/lib/SongLoader';
  import Playlist from '@/lib/Playlist';
  import ISongInfo from '@/lib/data/ISongInfo';

  export default Vue.extend({
    name: 'BtnToggleAddRemoveSongInPlaylists',
    props: {
      song: {type: Object, required: true},
      icon: {type: Boolean, default: false },
      value: {type: String, default: undefined},
    },
    components: {PlaylistCover},
    data: () => ({
      dialog: false,
    }),
    computed: {
      playlists: get('songs/playlists'),
    },
    async mounted() {
      await store.dispatch('songs/loadPlaylists');
    },
    methods: {
      IsInPlaylist(playlist: Playlist) {
        return !!playlist.songs.find((s: ISongInfo) => s.hash === (this.song as ISongInfo).hash);
      },
      Add(playlist: Playlist) {
        store.commit('songs/addSongToPlaylist', {playlist, song: this.song});
      },
      Remove(playlist: Playlist) {
        store.commit('songs/removeSongFromPlaylist', {playlist, song: this.song});
      },
    },
  });
</script>

<style scoped>

</style>
