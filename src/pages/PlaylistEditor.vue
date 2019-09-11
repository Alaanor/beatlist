<template>
  <v-container>
    <v-layout align-center justify-start row fill-height>
      <v-btn icon class="mr-3" to="/playlists/local" exact>
        <v-icon medium>chevron_left</v-icon>
      </v-btn>
      <p class="display-2">Playlist editor</p>
    </v-layout>
    <br>
    <v-layout align-start>
      <v-item-group v-model="window" class="shrink mr-4" mandatory tag="v-flex">
        <v-item v-for="n in length" :key="n">
          <div slot-scope="{ active, toggle }">
            <v-btn :input-value="active" icon @click="toggle">
              <v-icon>fiber_manual_record</v-icon>
            </v-btn>
          </div>
        </v-item>
      </v-item-group>
      <v-flex>
        <v-window v-model="window">
          <v-window-item key="1">
            <PlaylistEditorData :hash="hash"></PlaylistEditorData>
          </v-window-item>
          <v-window-item key="2">
            <PlaylistEditorSongsReader :hash="hash"></PlaylistEditorSongsReader>
          </v-window-item>
          <v-window-item key="3">
            <PlaylistEditorSongsBrowser :hash="hash"></PlaylistEditorSongsBrowser>
          </v-window-item>
        </v-window>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
  import Vue from 'vue';
  import PlaylistEditorData from '../components/PlaylistEditorData';
  import PlaylistEditorSongsReader from '../components/PlaylistEditorSongsReader';
  import PlaylistEditorSongsBrowser from '../components/PlaylistEditorSongsBrowser';

  export default Vue.extend({
    name: 'PlaylistEditor',
    components: {
      PlaylistEditorData,
      PlaylistEditorSongsReader,
      PlaylistEditorSongsBrowser,
    },
    data: () => ({
      length: 3,
      window: 0,
    }),
    computed: {
      hash() {
        return this.$route.params.hash;
      },
    },
  });
</script>
