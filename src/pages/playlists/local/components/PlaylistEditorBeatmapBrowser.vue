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
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import { PlaylistLocal } from '@/libraries/playlist/PlaylistLocal';
import BeatmapsTableColumnSelector
  from '@/components/beatmap/table/core/BeatmapsTableColumnSelector.vue';
import BeatmapsTable from '@/components/beatmap/table/BeatmapsTable.vue';
import PlaylistButtonAddToPlaylist
  from '@/components/playlist/button/PlaylistButtonAddToPlaylist.vue';
import { BeatmapsTableDataUnit } from '@/components/beatmap/table/core/BeatmapsTableDataUnit';
import BeatmapLibrary from '@/libraries/beatmap/BeatmapLibrary';
import { BeatmapLocal } from '@/libraries/beatmap/BeatmapLocal';

export default Vue.extend({
  name: 'PlaylistEditorBeatmapBrowser',
  components: { BeatmapsTableColumnSelector, BeatmapsTable, PlaylistButtonAddToPlaylist },
  props: {
    playlist: { type: Object as PropType<PlaylistLocal>, required: true },
  },
  data: () => ({
    shownColumn: ['cover', 'name', 'artist', 'mapper'],
  }),
  computed: {
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
