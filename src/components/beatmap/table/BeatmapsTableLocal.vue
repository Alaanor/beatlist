<template>
  <v-container>
    <BeatmapsTableColumnSelector v-model="shownColumn"/>
    <v-card>
      <BeatmapsTable
        :items="beatmaps"
        :shown-column="shownColumn"
        :items-per-page.sync="itemsPerPage"
        see-more-route-name="beatmaps-local-unit"
      />
    </v-card>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue';
import { sync } from 'vuex-pathify';
import { BeatmapsTableDataUnit } from '@/components/beatmap/table/core/BeatmapsTableDataUnit';
import BeatmapsTable from '@/components/beatmap/table/BeatmapsTable.vue';
import BeatmapsTableColumnSelector from '@/components/beatmap/table/core/BeatmapsTableColumnSelector.vue';
import BeatmapLibrary from '@/libraries/beatmap/BeatmapLibrary';

export default Vue.extend({
  name: 'BeatmapTableLocal',
  components: { BeatmapsTableColumnSelector, BeatmapsTable },
  computed: {
    shownColumn: sync<string[]>('settings/beatmapsTable@localBeatmaps.shownColumn'),
    itemsPerPage: sync<string[]>('settings/beatmapsTable@localBeatmaps.itemsPerPage'),
    beatmaps: () => BeatmapLibrary.GetAllValidMap()
      .map((beatmap): BeatmapsTableDataUnit => ({
        local: beatmap,
        data: beatmap.onlineData,
      })),
  },
});
</script>
