<!--suppress XmlUnboundNsPrefix -->
<template>
  <v-container>
    <v-layout row justify-space-between>
      <h1>Playlists</h1>
      <v-btn flat @click="NewPlaylist()" :loading="loadingAdd">
        Add a new Playlist
        <v-icon class="ml-1">add</v-icon>
      </v-btn>
    </v-layout>
    <v-container fluid grid-list-lg v-if="playlists !== null">
      <v-data-iterator
              :items="playlists"
              :rows-per-page-items="rowsPerPageItems"
              :pagination.sync="pagination"
              content-tag="v-layout" row wrap>
        <template v-slot:item="props">
          <v-flex my-3>
            <Playlist :data="props.item"></Playlist>
          </v-flex>
        </template>
      </v-data-iterator>
    </v-container>
  </v-container>
</template>

<script lang="ts">
  import Vue from 'vue';
  import {get} from 'vuex-pathify';
  import store from '@/store/store';
  import Playlist from '@/components/Playlist.vue';
  import BeatSaber from '@/lib/BeatSaber';

  export default Vue.extend({
    name: 'Playlists',
    components: {Playlist},
    data: () => ({
      rowsPerPageItems: [6, 12, 24, 48],
      pagination: {
        rowsPerPage: 6,
      },
      loadingAdd: false,
    }),
    computed: {
      installationPath: get('settings/installationPath'),
      playlists: get('songs/playlists'),
    },
    methods: {
      async NewPlaylist() {
        this.loadingAdd = true;
        const instPath = this.installationPath as string;
        const playlist = await new BeatSaber(instPath)
          .CreateNewPlaylistFile();
        await store.dispatch('songs/loadPlaylists');
        this.$router.push({name: 'playlistEditor', params: {hash: playlist.playlistHash}});
      }
    },
    async mounted() {
      await store.dispatch('songs/loadPlaylists');
    },
  });
</script>
