<template>
  <v-container>
    <p class="display-2">
      Beastsaber Playlists
    </p>

    <BeastsaberPlaylistBrowser />
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import DiscordRichPresence from "@/libraries/ipc/DiscordRichPresence";
import BeastsaberPlaylistBrowser from "@/components/playlist/bsaber/BeastsaberPlaylistBrowser.vue";

export default Vue.extend({
  name: "PlaylistsBsaber",
  components: { BeastsaberPlaylistBrowser },
  beforeRouteEnter(to, from, next) {
    DiscordRichPresence.UpdateStatus("Browsing online playlist");
    next();
  },
});
</script>
