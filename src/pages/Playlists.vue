<!--suppress ALL -->
<template>
  <v-container>
    <v-layout row justify-space-between>
      <h1>Playlists</h1>
      <v-btn flat @click="NewPlaylist()" :loading="loadingAdd">
        Add a new Playlist
        <v-icon class="ml-1">add</v-icon>
      </v-btn>
    </v-layout>
    <ListViewerForPlaylists :action="GoToPlaylist">
      <template #item-block-action="{item}">
        <v-btn icon exact :to="`playlist/edit/${item.playlistHash}`">
          <v-icon>chevron_right</v-icon>
        </v-btn>
      </template>
      <template #item-list-action="{item}">
        <v-btn icon exact :to="`playlist/edit/${item.playlistHash}`">
          <v-icon>chevron_right</v-icon>
        </v-btn>
      </template>
    </ListViewerForPlaylists>
  </v-container>
</template>

<script>
  import Vue from 'vue';
  import {get} from 'vuex-pathify';
  import store from '@/store/store';
  import BeatSaber from '@/lib/BeatSaber';
  import ListViewerForPlaylists from '@/components/ListViewerForPlaylists.vue';

  export default Vue.extend({
    name: 'Playlists',
    components: {ListViewerForPlaylists},
    data: () => ({
      rowsPerPageItems: [6, 12, 24, 48],
      pagination: {
        rowsPerPage: 6,
      },
      loadingAdd: false,
    }),
    computed: {
      installationPath: get('settings/installationPath'),
    },
    methods: {
      async NewPlaylist() {
        this.loadingAdd = true;
        const playlist = await new BeatSaber(this.installationPath)
          .CreateNewPlaylistFile();
        await store.dispatch('songs/loadPlaylists');
        this.GoToPlaylist(playlist);
      },
      GoToPlaylist(playlist) {
        this.$router.push({name: 'playlistEditor', params: {hash: playlist.playlistHash}});
      },
    },
    async mounted() {
      await store.dispatch('songs/loadPlaylists');
    },
  });
</script>
