<template>
  <v-container>
    <div v-if="!playlistLocal" class="d-flex align-center flex-column">
      <v-progress-circular indeterminate color="grey" :size="60" />
      <span class="pt-3 text--disabled">Loading</span>
      <span class="pt-2 text--disabled">
        {{ progress ? `${progress.get().done}/${progress.get().total}` : "" }}
      </span>
    </div>
    <!-- playlist info -->
    <BeastsaberPlaylistContentTable
      v-if="playlistLocal"
      :playlist="playlistLocal"
    />
  </v-container>
</template>

<script lang="ts">
import Vue, { PropType } from "vue";
import { PlaylistLocal } from "@/libraries/playlist/PlaylistLocal";
import BeastsaberPlaylist from "@/libraries/net/bsaber/BeastsaberPlaylist";
import Progress from "@/libraries/common/Progress";
import BeastsaberPlaylistContentTable from "@/components/playlist/bsaber/BeastsaberPlaylistContentTable.vue";

export default Vue.extend({
  name: "BeastsaberPlaylistContent",
  components: { BeastsaberPlaylistContentTable },
  props: {
    playlistBeastsaber: {
      type: Object as PropType<BeastsaberPlaylist | undefined>,
      default: undefined,
    },
    playlistLocal: {
      type: Object as PropType<PlaylistLocal | undefined>,
      default: undefined,
    },
    progress: { type: Object as PropType<Progress>, default: undefined },
    error: { type: Object as PropType<string | undefined>, default: undefined },
  },
});
</script>

<style scoped></style>
