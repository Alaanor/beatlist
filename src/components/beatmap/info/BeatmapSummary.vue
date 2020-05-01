<template>
  <v-container>
    <BeatmapSummaryHeader :beatmap="beatmap" />
    <BeatmapSummaryActions :beatmap="beatmap" />
    <BeatmapSummaryBaseInfo :beatmap="beatmap" />
    <BeatmapSummaryCharacteristic :beatmap="beatmap" />
  </v-container>
</template>

<script lang="ts">
import Vue, { PropType } from "vue";
import { BeatsaverBeatmap } from "@/libraries/net/beatsaver/BeatsaverBeatmap";
import BeatmapSummaryHeader from "@/components/beatmap/info/BeatmapSummaryHeader.vue";
import BeatmapSummaryActions from "@/components/beatmap/info/BeatmapSummaryActions.vue";
import BeatmapSummaryBaseInfo from "@/components/beatmap/info/BeatmapSummaryBaseInfo.vue";
import BeatmapSummaryCharacteristic from "@/components/beatmap/info/BeatmapSummaryCharacteristic.vue";

export default Vue.extend({
  name: "BeatmapSummary",
  components: {
    BeatmapSummaryHeader,
    BeatmapSummaryActions,
    BeatmapSummaryBaseInfo,
    BeatmapSummaryCharacteristic,
  },
  props: {
    beatmap: { type: Object as PropType<BeatsaverBeatmap>, required: true },
  },
});
</script>
