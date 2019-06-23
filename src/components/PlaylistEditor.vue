<template>
  <v-container>
    <v-layout align-center justify-start row fill-height>
      <v-btn icon class="mr-3" to="/playlist" exact>
        <v-icon medium>chevron_left</v-icon>
      </v-btn>
      <h1>Playlist editor</h1>
    </v-layout>
    <br>
    <v-layout align-center>
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
        <v-window v-model="window" class="elevation-1" vertical>
          <v-window-item key="1">
            <v-card flat>
              <PlaylistEditorData :data="playlist"></PlaylistEditorData>
            </v-card>
          </v-window-item>
          <v-window-item key="2">
            <v-card flat>
              <v-card-text>
                <v-layout align-center mb-3>
                  <v-avatar class="mr-3">
                    <v-img v-if="imageData.length > 0" :src="imageData"></v-img>
                  </v-avatar>
                  <strong class="title">{{playlist.playlistTitle}}</strong>
                </v-layout>
                <p>@TODO</p>
              </v-card-text>
            </v-card>
          </v-window-item>
        </v-window>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
  import Vue from 'vue';
  import {get} from 'vuex-pathify';
  import Playlist from '../lib/Playlist';
  import PlaylistEditorData from './PlaylistEditorData';

  export default Vue.extend({
    name: 'PlaylistEditor',
    components: { PlaylistEditorData },
    data: () => ({
      length: 2,
      window: 0,
      imageData: '',
    }),
    methods: {
      LoadImage() {
        Playlist
          .LoadCover(this.playlist.playlistPath)
          .then((data) => this.imageData = data);
      },
    },
    computed: {
      hash() {
        return this.$route.params.hash;
      },
      playlist() {
        return this.playlists.find((p) => p.playlistHash === this.hash);
      },
      playlists: get('songs/playlists'),
    },
    mounted() {
      this.$nextTick(async function () {
        this.LoadImage();
      });
    },
  });
</script>
