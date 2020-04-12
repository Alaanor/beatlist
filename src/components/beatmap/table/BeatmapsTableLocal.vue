<template>
  <v-container>
    <BeatmapsTableOuterHeader
      :shown-column.sync="shownColumn"
      :search.sync="search"
    />
    <v-card>
      <BeatmapsTable
        :items="beatmaps"
        :shown-column="shownColumn"
        :items-per-page.sync="itemsPerPage"
        :search="search"
        see-more-route-name="beatmaps-local-unit"
      >
        <template #actions="{ beatsaver }">
          <BeatmapButtonAddToNPlaylists :beatmap="beatsaver"/>
        </template>
      </BeatmapsTable>
    </v-card>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue';
import { sync } from 'vuex-pathify';
import { BeatmapsTableDataUnit } from '@/components/beatmap/table/core/BeatmapsTableDataUnit';
import BeatmapsTable from '@/components/beatmap/table/BeatmapsTable.vue';
import BeatmapLibrary from '@/libraries/beatmap/BeatmapLibrary';
import BeatmapsTableOuterHeader from '@/components/beatmap/table/core/BeatmapsTableOuterHeader.vue';
import BeatmapButtonAddToNPlaylists
  from '@/components/beatmap/button/BeatmapButtonAddToNPlaylists.vue';
import BeatsaverCachedLibrary from '@/libraries/beatmap/repo/BeatsaverCachedLibrary';

export default Vue.extend({
  name: 'BeatmapTableLocal',
  components: {
    BeatmapsTable,
    BeatmapsTableOuterHeader,
    BeatmapButtonAddToNPlaylists,
  },
  data: () => ({
    search: '',
  }),
  computed: {
    shownColumn: sync<string[]>('settings/beatmapsTable@localBeatmaps.shownColumn'),
    itemsPerPage: sync<string[]>('settings/beatmapsTable@localBeatmaps.itemsPerPage'),
    beatmaps: () => BeatmapLibrary.GetAllValidMap()
      .map((beatmap) => ({
        local: beatmap,
        data: BeatsaverCachedLibrary.getByHash(beatmap.hash)?.beatmap,
      }))
      .filter((beatmap) => beatmap.data !== undefined) as BeatmapsTableDataUnit[],
  },
});
</script>
