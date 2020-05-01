<template>
  <span>
    <Tooltip text="Add/Remove from playlists">
      <v-btn icon :small="small" @click="dialog = true">
        <v-icon :small="small">
          playlist_add
        </v-icon>
      </v-btn>
    </Tooltip>
    <AddRemoveFromPlaylistsDialog :open.sync="dialog" :beatmap="beatmap" />
  </span>
</template>

<script lang="ts">
import Vue, { PropType } from "vue";
import { BeatsaverBeatmap } from "@/libraries/net/beatsaver/BeatsaverBeatmap";
import Tooltip from "@/components/helper/Tooltip.vue";
import AddRemoveFromPlaylistsDialog from "@/components/dialogs/AddRemoveFromPlaylistsDialog.vue";

export default Vue.extend({
  name: "BeatmapButtonAddToNPlaylists",
  components: { Tooltip, AddRemoveFromPlaylistsDialog },
  props: {
    beatmap: { type: Object as PropType<BeatsaverBeatmap>, required: true },
    small: { type: Boolean, default: false },
  },
  data: () => ({
    dialog: false,
  }),
});
</script>

<style scoped></style>
