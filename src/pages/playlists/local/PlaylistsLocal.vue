<template>
  <v-container>
    <p class="display-2">
      Local Playlists
    </p>
    <v-container class="d-flex align-center">
      <v-subheader>actions</v-subheader>
      <PlaylistButtonNewPlaylist/>
    </v-container>

    <PlaylistsListViewer
      :playlists="playlists"
      :action="openPlaylist"
    >
      <template #actions="{ playlist }">
        <div class="d-flex">
          <PlaylistButtonRemovePlaylist :playlist="playlist"/>
          <Tooltip text="See more">
            <v-btn
              icon
              :to="{ name: 'playlists-local-unit', params: { hash: playlist.hash } }"
            >
              <v-icon>chevron_right</v-icon>
            </v-btn>
          </Tooltip>
        </div>
      </template>
    </PlaylistsListViewer>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue';
import PlaylistsListViewer from '@/components/playlist/list/PlaylistsListViewer.vue';
import PlaylistLibrary from '@/libraries/playlist/PlaylistLibrary';
import { PlaylistLocal } from '@/libraries/playlist/PlaylistLocal';
import PlaylistButtonNewPlaylist from '@/components/playlist/button/PlaylistButtonNewPlaylist.vue';
import PlaylistButtonRemovePlaylist from '@/components/playlist/button/PlaylistButtonRemovePlaylist.vue';
import Tooltip from '@/components/helper/Tooltip.vue';

export default Vue.extend({
  name: 'PlaylistsLocal',
  components: {
    PlaylistsListViewer, PlaylistButtonNewPlaylist, PlaylistButtonRemovePlaylist, Tooltip,
  },
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
