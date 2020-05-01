<template>
  <span>
    <PlaylistButtonAddToPlaylist
      v-if="!isAlreadyInPlaylist"
      :beatmap="beatmap"
      :playlist="playlist"
      :small="small"
    />
    <PlaylistButtonRemoveFromPlaylist
      v-else
      :beatmap="beatmap"
      :playlist="playlist"
      :small="small"
    />
  </span>
</template>

<script lang="ts">
import Vue, { PropType } from "vue";
import PlaylistButtonAddToPlaylist from "@/components/playlist/button/PlaylistButtonAddToPlaylist.vue";
import PlaylistButtonRemoveFromPlaylist from "@/components/playlist/button/PlaylistButtonRemoveFromPlaylist.vue";
import { PlaylistLocal } from "@/libraries/playlist/PlaylistLocal";
import { BeatsaverBeatmap } from "@/libraries/net/beatsaver/BeatsaverBeatmap";

export default Vue.extend({
  name: "PlaylistButtonAddRemoveTogglePlaylist",
  components: { PlaylistButtonAddToPlaylist, PlaylistButtonRemoveFromPlaylist },
  props: {
    playlist: { type: Object as PropType<PlaylistLocal>, required: true },
    beatmap: { type: Object as PropType<BeatsaverBeatmap>, required: true },
    small: { type: Boolean, default: false },
  },
  computed: {
    isAlreadyInPlaylist(): boolean {
      return this.playlist.maps.some((map) => map.hash === this.beatmap.hash);
    },
  },
});
</script>

<style scoped></style>
