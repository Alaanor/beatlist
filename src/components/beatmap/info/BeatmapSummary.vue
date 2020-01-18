<template>
  <v-container>
    <BeatmapSummaryHeader :beatmap="beatmap"/>
    <BeatmapSummaryBaseInfo :beatmap="beatmap"/>
    <BeatmapSummaryCharacteristic :beatmap="beatmap"/>
  </v-container>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import { BeatsaverBeatmap } from '@/libraries/net/beatsaver/BeatsaverBeatmap';
import BeatmapSummaryHeader from '@/components/beatmap/info/BeatmapSummaryHeader.vue';
import BeatmapSummaryBaseInfo from '@/components/beatmap/info/BeatmapSummaryBaseInfo.vue';
import BeatmapSummaryCharacteristic from '@/components/beatmap/info/BeatmapSummaryCharacteristic.vue';

export default Vue.extend({
  name: 'BeatmapSummary',
  components: { BeatmapSummaryHeader, BeatmapSummaryBaseInfo, BeatmapSummaryCharacteristic },
  props: {
    beatmap: { type: Object as PropType<BeatsaverBeatmap>, required: true },
  },
  computed: {
    gradientColor(): string {
      return this.$vuetify.theme.dark ? '48, 48, 48' : '255, 255, 255';
    },
  },
});
</script>
