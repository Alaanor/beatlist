<template>
  <v-container>
    <p class="display-2">
      Local playlists
    </p>
    <PlaylistsListViewer
      :playlists="playlists"
      :action="openPlaylist"
    >
      <template #actions="{ playlist }">
        <v-btn
          icon
          :to="{ name: 'playlists-local-unit', params: { hash: playlist.hash } }"
        >
          <v-icon>chevron_right</v-icon>
        </v-btn>
      </template>
    </PlaylistsListViewer>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue';
import PlaylistsListViewer from '@/components/playlist/list/PlaylistsListViewer.vue';
import PlaylistLibrary from '@/libraries/playlist/PlaylistLibrary';
import { PlaylistLocal } from '@/libraries/playlist/PlaylistLocal';

export default Vue.extend({
  name: 'PlaylistsLocal',
  components: { PlaylistsListViewer },
  computed: {
    playlists: () => PlaylistLibrary.GetAllValidPlaylists(),
  },
  methods: {
    openPlaylist(playlist: PlaylistLocal): void {
      this.$router.push({ name: 'playlists-local-unit', params: { hash: playlist.hash } });
    },
  },
});
</script>

<style scoped>

</style>
