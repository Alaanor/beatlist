<!--suppress HtmlUnknownBooleanAttribute, XmlUnboundNsPrefix -->
<template>
  <v-container>
    <h1>Playlist</h1>
    <v-container v-if="playlists !== null">
      <v-layout row wrap>
        <v-flex>
          <v-expansion-panel popout>
            <v-expansion-panel-content v-for="playlist in playlists">
              <template v-slot:header>
                <div>{{playlist.playlistTitle}} ({{playlist.songs.length}})</div>
              </template>
              <v-card>
                <v-card-text>
                  Path: {{playlist.playlistPath}}
                </v-card-text>
              </v-card>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-flex>
      </v-layout>
    </v-container>
  </v-container>
</template>

<script lang="ts">
  import Vue from 'vue';
  import {get} from 'vuex-pathify';
  import Playlist from '@/lib/Playlist';
  import store from '@/store/store';

  export default Vue.extend({
    name: 'Playlist',
    computed: {
      playlists: get('songs/playlists'),
    },
    async mounted() {
      await store.dispatch('songs/loadPlaylists');
    },
  });
</script>
