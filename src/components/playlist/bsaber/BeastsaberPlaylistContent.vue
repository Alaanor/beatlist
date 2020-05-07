<template>
  <v-container>
    <!-- playlist info -->
    <!-- beatmaps table -->
  </v-container>
</template>

<script lang="ts">
import Vue, { PropType } from "vue";
import { PlaylistLocal } from "@/libraries/playlist/PlaylistLocal";
import BeastsaberPlaylist from "@/libraries/net/bsaber/BeastsaberPlaylist";
import Progress from "@/libraries/common/Progress";

export default Vue.extend({
  name: "BeastsaberPlaylistContent",
  props: {
    playlistBeastsaber: {
      type: Object as PropType<BeastsaberPlaylist>,
      required: true,
    },
    playlistLocal: {
      type: Object as PropType<PlaylistLocal | undefined>,
      required: true,
    },
    progress: { type: Object as PropType<Progress>, default: undefined },
    error: { type: Object as PropType<string | undefined>, default: undefined },
  },
});
</script>

<style scoped></style>
