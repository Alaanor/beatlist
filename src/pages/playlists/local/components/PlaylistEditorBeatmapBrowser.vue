<template>
  <div>
    <p class="headline">
      Browser
    </p>
    <BeatmapsTableColumnSelector
      v-model="shownColumn"
    />
    <BeatmapsTable
      :items="beatmaps"
      :shown-column="shownColumn"
      :items-per-page.sync="itemsPerPage"
      :selected.sync="selectedBeatmap"
      see-more-route-name="beatmaps-online-unit"
    >
      <template #actions="{ beatsaver }">
        <PlaylistButtonAddToPlaylist
          :playlist="playlist"
          :beatmap="beatsaver"
          small
        />
      </template>
    </BeatmapsTable>
    <BeatmapsTableBulkActions
      :playlist="playlist"
      :selected="selectedBeatmap"
      bulk-add
    />
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import { sync } from 'vuex-pathify';
import { PlaylistLocal } from '@/libraries/playlist/PlaylistLocal';
import BeatmapsTableColumnSelector
  from '@/components/beatmap/table/core/BeatmapsTableColumnSelector.vue';
import BeatmapsTable from '@/components/beatmap/table/BeatmapsTable.vue';
import PlaylistButtonAddToPlaylist
  from '@/components/playlist/button/PlaylistButtonAddToPlaylist.vue';
import { BeatmapsTableDataUnit } from '@/components/beatmap/table/core/BeatmapsTableDataUnit';
import BeatmapLibrary from '@/libraries/beatmap/BeatmapLibrary';
import { BeatmapLocal } from '@/libraries/beatmap/BeatmapLocal';
import { BeatsaverBeatmap } from '@/libraries/net/beatsaver/BeatsaverBeatmap';
import BeatmapsTableBulkActions from '@/components/beatmap/table/core/BeatmapsTableBulkActions.vue';

export default Vue.extend({
  name: 'PlaylistEditorBeatmapBrowser',
  components: {
    BeatmapsTableColumnSelector,
    BeatmapsTable,
    PlaylistButtonAddToPlaylist,
    BeatmapsTableBulkActions,
  },
  props: {
    playlist: { type: Object as PropType<PlaylistLocal>, required: true },
  },
  data: () => ({
    selectedBeatmap: [] as BeatsaverBeatmap[],
  }),
  computed: {
    shownColumn: sync<string[]>('settings/beatmapsTable@playlistBrowser.shownColumn'),
    itemsPerPage: sync<string[]>('settings/beatmapsTable@playlistBrowser.itemsPerPage'),
    allValidBeatmaps: (): BeatmapLocal[] => BeatmapLibrary.GetAllValidMap(),
    beatmaps(): BeatmapsTableDataUnit[] {
      return this.allValidBeatmaps
        .map((entry: BeatmapLocal) => ({
          local: entry,
          data: entry.onlineData,
        }) as BeatmapsTableDataUnit);
    },
  },
});
</script>

<style scoped>

</style>
