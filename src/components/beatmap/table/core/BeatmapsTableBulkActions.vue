<template>
  <div style="height: 52px">
    <v-slide-x-transition>
      <v-container
        v-if="selected.length > 0"
        class="d-flex align-center"
      >
        <v-btn
          v-if="bulkAdd"
          outlined
          small
          color="success"
          :loading="bulkAddLoading"
          @click="performBulkAdd"
        >
          Add all
        </v-btn>

        <v-btn
          v-if="bulkRemove"
          outlined
          small
          color="error"
          :loading="bulkRemoveLoading"
          @click="performBulkRemove"
        >
          Remove all
        </v-btn>

        <span class="pl-3">
          {{ selected.length }} item{{ selected.length > 1 ? 's' : '' }} selected
        </span>
      </v-container>
    </v-slide-x-transition>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import { BeatsaverBeatmap } from '@/libraries/net/beatsaver/BeatsaverBeatmap';
import PlaylistOperation from '@/libraries/playlist/PlaylistOperation';
import { PlaylistLocal } from '@/libraries/playlist/PlaylistLocal';

export default Vue.extend({
  name: 'BeatmapsTableBulkActions',
  props: {
    playlist: { type: Object as PropType<PlaylistLocal>, required: true },
    selected: { type: Array as PropType<BeatsaverBeatmap[]>, required: true },
    bulkAdd: { type: Boolean, default: false },
    bulkRemove: { type: Boolean, default: false },
  },
  data: () => ({
    bulkAddLoading: false,
    bulkRemoveLoading: false,
  }),
  methods: {
    performBulkAdd() {
      this.bulkAddLoading = true;
      PlaylistOperation.BulkAddMapInPlaylist(this.playlist, this.selected)
        .finally(() => {
          this.bulkAddLoading = false;
        });
    },
    performBulkRemove() {
      this.bulkRemoveLoading = true;
      PlaylistOperation.BulkRemoveMapFromPlaylist(this.playlist, this.selected)
        .finally(() => {
          this.bulkRemoveLoading = false;
        });
    },
  },
});
</script>

<style scoped>

</style>
