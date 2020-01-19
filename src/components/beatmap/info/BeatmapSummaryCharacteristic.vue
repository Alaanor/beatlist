<template>
  <v-card flat>
    <v-tabs
      v-model="tab"
      height="32"
      grow
    >
      <v-tab
        v-for="characteristic in beatmap.metadata.characteristics"
        :key="characteristic.name"
      >
        {{ characteristic.name }}
      </v-tab>
    </v-tabs>

    <v-tabs-items v-model="tab">
      <v-tab-item
        v-for="characteristic in beatmap.metadata.characteristics"
        :key="characteristic.name"
      >
        <BeatmapSummaryDifficultiesTabs :characteristic="characteristic"/>
      </v-tab-item>
    </v-tabs-items>
  </v-card>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import { BeatsaverBeatmap } from '@/libraries/net/beatsaver/BeatsaverBeatmap';
import BeatmapSummaryDifficultiesTabs from '@/components/beatmap/info/characteristic/BeatmapSummaryDifficultiesTabs.vue';

export default Vue.extend({
  name: 'BeatmapSummaryCharacteristic',
  components: { BeatmapSummaryDifficultiesTabs },
  props: {
    beatmap: { type: Object as PropType<BeatsaverBeatmap>, required: true },
  },
  data: () => ({
    tab: null,
  }),
});
</script>

<style scoped>

</style>
