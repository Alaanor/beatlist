<template>
  <v-container/>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import { BeatsaverBeatmap } from '@/libraries/net/beatsaver/BeatsaverBeatmap';

export default Vue.extend({
  name: 'BeatmapSummaryCharacteristic',
  props: {
    beatmap: { type: Object as PropType<BeatsaverBeatmap>, required: true },
  },
});
</script>

<style scoped>

</style>
