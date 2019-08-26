<template>
  <v-dialog v-model="dialog" scrollable max-width="450px">
    <template v-slot:activator="{ on }">
      <slot>
        <v-btn v-if="icon" v-on="on" @click.stop="" icon>
          <v-icon>{{value || 'add'}}</v-icon>
        </v-btn>
        <v-btn v-else text small v-on="on" @click.stop="">
          {{value || 'Add'}}
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
      <v-card-text>
        <v-list rounded avatar>
          <v-list-item v-for="playlist in playlists" @click="">
            <v-list-item-avatar>
              <PlaylistCover :playlist="playlist"></PlaylistCover>
            </v-list-item-avatar>
            <v-list-item-content>
              <v-list-item-title>{{playlist.playlistTitle}}</v-list-item-title>
              <v-list-item-subtitle>{{playlist.playlistAuthor}} - <span class="grey--text">{{playlist.songs.length}} songs</span>
              </v-list-item-subtitle>
            </v-list-item-content>
            <v-list-item-action>
              <v-btn icon @click="!IsInPlaylist(playlist)?Add(playlist):Remove(playlist)">
                <v-icon :color="!IsInPlaylist(playlist)?'success':'error'">
                  {{!IsInPlaylist(playlist)?'add':'remove'}}
                </v-icon>
              </v-btn>
            </v-list-item-action>
          </v-list-item>
        </v-list>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
  import Vue from 'vue';
  import {get} from 'vuex-pathify';
  import store from '@/store/store';
  import PlaylistCover from '@/components/PlaylistCover.vue';
  import Playlist from '@/lib/Playlist';
  import ISongInfo from '@/lib/data/ISongInfo';

  export default Vue.extend({
    name: 'BtnToggleAddRemoveSongInPlaylists',
    props: {
      song: {type: Object, required: true},
      icon: {type: Boolean, default: false},
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
