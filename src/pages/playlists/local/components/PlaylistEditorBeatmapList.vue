<template>
  <div>
    <p class="headline">
      Content
    </p>
    <BeatmapsTableColumnSelector
      v-model="shownColumn"
    />
    <BeatmapsTable
      :items="beatmaps"
      :items-per-page.sync="itemsPerPage"
      :shown-column="shownColumn"
      see-more-route-name="beatmaps-online-unit"
    >
      <template #actions="{ beatsaver }">
        <PlaylistButtonRemoveFromPlaylist
          :playlist="playlist"
          :beatmap="beatsaver"
          small
        />
      </template>
    </BeatmapsTable>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import { sync } from 'vuex-pathify';
import { PlaylistLocal } from '@/libraries/playlist/PlaylistLocal';
import BeatmapsTable from '@/components/beatmap/table/BeatmapsTable.vue';
import { BeatmapsTableDataUnit } from '@/components/beatmap/table/core/BeatmapsTableDataUnit';
import BeatmapsTableColumnSelector
  from '@/components/beatmap/table/core/BeatmapsTableColumnSelector.vue';
import PlaylistButtonRemoveFromPlaylist
  from '@/components/playlist/button/PlaylistButtonRemoveFromPlaylist.vue';
import PlaylistMapsLibrary from '@/libraries/playlist/PlaylistMapsLibrary';

export default Vue.extend({
  name: 'PlaylistEditorBeatmapList',
  components: { BeatmapsTableColumnSelector, BeatmapsTable, PlaylistButtonRemoveFromPlaylist },
  props: {
    playlist: { type: Object as PropType<PlaylistLocal>, required: true },
  },
  computed: {
    shownColumn: sync<string[]>('settings/beatmapsTable@playlistContent.shownColumn'),
    itemsPerPage: sync<string[]>('settings/beatmapsTable@playlistContent.itemsPerPage'),
    beatmaps(): BeatmapsTableDataUnit[] {
      return PlaylistMapsLibrary.GetAllValidMapFor(this.playlist)
        .map((entry) => ({
          local: undefined,
          data: entry.online,
        }) as BeatmapsTableDataUnit);
    },
  },
});
</script>

<style scoped>

</style>
