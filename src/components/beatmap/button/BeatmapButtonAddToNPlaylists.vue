<template>
  <v-container class="ma-0 pa-0">
    <Tooltip text="Add/Remove from playlists">
      <v-btn
        icon
        small
        @click="dialog = true"
      >
        <v-icon small>
          playlist_add
        </v-icon>
      </v-btn>
    </tooltip>
    <AddRemoveFromPlaylistsDialog :open.sync="dialog"/>
  </v-container>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import { BeatsaverBeatmap } from '@/libraries/net/beatsaver/BeatsaverBeatmap';
import Tooltip from '@/components/helper/Tooltip.vue';
import AddRemoveFromPlaylistsDialog from '@/components/dialogs/AddRemoveFromPlaylistsDialog.vue';

export default Vue.extend({
  name: 'BeatmapButtonAddToNPlaylists',
  components: { Tooltip, AddRemoveFromPlaylistsDialog },
  props: {
    beatmap: { type: Object as PropType<BeatsaverBeatmap>, required: true },
  },
  data: () => ({
    dialog: false,
  }),
});
</script>

<style scoped>

</style>
