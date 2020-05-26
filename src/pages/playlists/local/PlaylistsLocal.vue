<template>
  <v-container>
    <p class="display-2">
      Local Playlists
    </p>
    <v-container class="d-flex align-center">
      <v-subheader>actions</v-subheader>
      <PlaylistButtonNewPlaylist />
      <PlaylistButtonOpenFolder />
    </v-container>

    <PlaylistsListViewer :playlists="playlists" :action="openPlaylist">
      <template #actions="{ playlist }">
        <div class="d-flex">
          <PlaylistButtonRemovePlaylist :playlist="playlist" />
          <Tooltip text="See more">
            <v-btn
              icon
              :to="{
                name: playlistLocalUnitRouteName,
                params: { hash: playlist.hash },
              }"
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
import Vue from "vue";
import PlaylistsListViewer from "@/components/playlist/list/PlaylistsListViewer.vue";
import PlaylistLibrary from "@/libraries/playlist/PlaylistLibrary";
import { PlaylistLocal } from "@/libraries/playlist/PlaylistLocal";
import PlaylistButtonNewPlaylist from "@/components/playlist/button/PlaylistButtonNewPlaylist.vue";
import PlaylistButtonRemovePlaylist from "@/components/playlist/button/PlaylistButtonRemovePlaylist.vue";
import Tooltip from "@/components/helper/Tooltip.vue";
import NotificationService, {
  NOTIFICATION_ICON_FAILED,
} from "@/libraries/notification/NotificationService";
import PlaylistButtonOpenFolder from "@/components/playlist/button/PlaylistButtonOpenFolder.vue";
import DiscordRichPresence from "@/libraries/ipc/DiscordRichPresence";
import route from "@/plugins/route/route";

export default Vue.extend({
  name: "PlaylistsLocal",
  components: {
    PlaylistsListViewer,
    PlaylistButtonNewPlaylist,
    PlaylistButtonRemovePlaylist,
    PlaylistButtonOpenFolder,
    Tooltip,
  },
  beforeRouteEnter(to, from, next) {
    const amount = PlaylistLibrary.GetAllValidPlaylists().length;
    const amountText = `${amount} playlist${amount > 1 ? "s" : ""}`;
    DiscordRichPresence.UpdateStatus("Browsing local playlist", amountText);
    next();
  },
  computed: {
    playlists: () => PlaylistLibrary.GetAllValidPlaylists(),
    playlistLocalUnitRouteName: () => route.PLAYLISTS_LOCAL_UNIT,
  },
  methods: {
    openPlaylist(playlist: PlaylistLocal): void {
      if (playlist.hash) {
        this.$router.push({
          name: route.PLAYLISTS_LOCAL_UNIT,
          params: { hash: playlist.hash },
        });
      } else {
        NotificationService.NotifyMessage(
          "Somehow this map doesn't have hash, can't open the link",
          "error",
          NOTIFICATION_ICON_FAILED,
          2500
        );
      }
    },
  },
});
</script>

<style scoped></style>
