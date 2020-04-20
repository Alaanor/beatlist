<template>
  <Tooltip text="Preview beatmap">
    <v-btn
      icon
      @click="openPreview"
    >
      <v-icon>remove_red_eye</v-icon>
    </v-btn>
  </Tooltip>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import { shell } from 'electron';
import { BeatsaverBeatmap } from '@/libraries/net/beatsaver/BeatsaverBeatmap';
import Tooltip from '@/components/helper/Tooltip.vue';

export default Vue.extend({
  name: 'BeatmapButtonOpenPreview',
  components: { Tooltip },
  props: {
    beatmap: { type: Object as PropType<BeatsaverBeatmap>, required: true },
  },
  methods: {
    openPreview(): void {
      shell.openExternal(`https://skystudioapps.com/bs-viewer/?id=${this.beatmap.key}`);
    },
  },
});
</script>

<style scoped>

</style>
