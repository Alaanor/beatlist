<template>
  <div>
    <v-tabs
      v-model="tab"
      height="32"
      grow
    >
      <v-tab
        v-for="entry in characteristicFiltered"
        :key="entry.name"
        :class="`${getColorFor(entry.name)}--text`"
      >
        {{ entry.name }}
      </v-tab>
    </v-tabs>

    <v-tabs-items v-model="tab">
      <v-tab-item
        v-for="entry in characteristicFiltered"
        :key="entry.name"
      >
        <v-card
          flat
          tile
        >
          <v-card-text>
            <BeatmapSummaryDifficulty :difficulty="entry.difficulties"/>
          </v-card-text>
        </v-card>
      </v-tab-item>
    </v-tabs-items>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import { Characteristic, DifficultiesDetailed } from '@/libraries/net/beatsaver/BeatsaverBeatmap';
import BeatmapSummaryDifficulty from '@/components/beatmap/info/characteristic/BeatmapSummaryDifficulty.vue';
import { getColorFor, getWeightFor } from '@/libraries/helper/DifficultiesHelper';

export default Vue.extend({
  name: 'BeatmapSummaryDifficultiesTabs',
  components: { BeatmapSummaryDifficulty },
  props: {
    characteristic: { type: Object as PropType<Characteristic>, required: true },
  },
  data: () => ({
    tab: null,
  }),
  computed: {
    characteristicFiltered(): {name: string, difficulties: DifficultiesDetailed}[] {
      return Object.entries(this.characteristic.difficulties)
        .filter((value) => value[1])
        .map((value) => ({
          name: value[0] as string,
          weight: getWeightFor(value[0]),
          difficulties: value[1] as DifficultiesDetailed,
        }))
        .sort((a, b) => (a?.weight ?? 0) - (b?.weight ?? 0));
    },
  },
  methods: {
    getColorFor(diff: string) {
      return getColorFor(diff);
    },
  },
});
</script>

<style>
  .v-tab--active {
    color: slategrey !important;
  }
</style>
