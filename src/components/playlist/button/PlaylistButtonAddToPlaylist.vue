<template>
  <Tooltip text="Add to playlist">
    <v-btn
      color="success"
      :small="small"
      :loading="loading"
      :disabled="isAlreadyInPlaylist"
      icon
      @click="Add"
    >
      <v-icon :small="small">
        add
      </v-icon>
    </v-btn>
  </Tooltip>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import Tooltip from '@/components/helper/Tooltip.vue';
import { BeatsaverBeatmap } from '@/libraries/net/beatsaver/BeatsaverBeatmap';
import { PlaylistLocal } from '@/libraries/playlist/PlaylistLocal';
import PlaylistOperation from '@/libraries/playlist/PlaylistOperation';

export default Vue.extend({
  name: 'PlaylistButtonAddToPlaylist',
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
      return this.playlist.maps.some((map) => map.online?.hash === this.beatmap.hash);
    },
  },
  methods: {
    Add(): void {
      this.loading = true;
      PlaylistOperation.AddMapInPlaylist(this.playlist, this.beatmap)
        .finally(() => { this.loading = false; });
    },
  },
});
</script>
