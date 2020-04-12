<template>
  <Tooltip text="Remove from playlist">
    <v-btn
      color="error"
      :small="small"
      :loading="loading"
      :disabled="!isAlreadyInPlaylist || lockPlaylistModification"
      icon
      @click="Remove"
    >
      <v-icon :small="small">
        remove
      </v-icon>
    </v-btn>
  </Tooltip>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import { sync } from 'vuex-pathify';
import Tooltip from '@/components/helper/Tooltip.vue';
import { BeatsaverBeatmap } from '@/libraries/net/beatsaver/BeatsaverBeatmap';
import { PlaylistLocal } from '@/libraries/playlist/PlaylistLocal';
import PlaylistOperation from '@/libraries/playlist/PlaylistOperation';

export default Vue.extend({
  name: 'PlaylistButtonRemoveFromPlaylist',
  components: { Tooltip },
  props: {
    playlist: { type: Object as PropType<PlaylistLocal>, required: true },
    beatmap: { type: Object as PropType<BeatsaverBeatmap>, required: true },
    small: { type: Boolean, default: false },
  },
  data: () => ({
    loading: false,
  }),
  computed: {
    isAlreadyInPlaylist(): boolean {
      return this.playlist.maps.some((map) => map.hash === this.beatmap.hash);
    },
    lockPlaylistModification: sync<boolean>('appState/lockPlaylistModification'),
  },
  methods: {
    Remove() {
      this.loading = true;
      this.lockPlaylistModification = true;
      PlaylistOperation.RemoveMapFromPlaylist(this.playlist, this.beatmap)
        .finally(() => {
          this.loading = false;
          this.lockPlaylistModification = false;
        });
    },
  },
});
</script>
