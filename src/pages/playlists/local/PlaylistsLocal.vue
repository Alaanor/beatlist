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
import NotificationService, { NOTIFICATION_ICON_FAILED } from '@/libraries/notification/NotificationService';

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
      if (playlist.hash) {
        this.$router.push({ name: 'playlists-local-unit', params: { hash: playlist.hash } });
      } else {
        NotificationService.NotifyMessage(
          "Somehow this map doesn't have hash, can't open the link",
          'error',
          NOTIFICATION_ICON_FAILED,
          2500,
        );
      }
    },
  },
});
</script>

<style scoped>

</style>
