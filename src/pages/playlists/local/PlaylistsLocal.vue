<template>
  <v-container>
    <p class="display-2">
      Local playlists
    </p>
    <PlaylistsListViewer :playlists="playlists"/>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue';
import PlaylistsListViewer from '@/components/playlist/list/PlaylistsListViewer.vue';
import PlaylistLibrary from '@/libraries/playlist/PlaylistLibrary';

export default Vue.extend({
  name: 'PlaylistsLocal',
  components: { PlaylistsListViewer },
  computed: {
    playlists: () => PlaylistLibrary.GetAllValidPlaylists(),
  },
});
</script>

<style scoped>

</style>
