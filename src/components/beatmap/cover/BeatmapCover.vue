<template>
  <v-icon v-if="imageSrc === 'error'">
    not_interested
  </v-icon>
  <v-img
    v-else
    :src="imageSrc"
    :gradient="gradient"
    alt="Beatmap cover"
    @error="imageSrc = 'error'"
  >
    <slot/>
    <template v-slot:placeholder>
      <v-row
        class="fill-height ma-0"
        align="center"
        justify="center"
      >
        <v-progress-circular
          indeterminate
          :size="progressSize"
          color="grey"
        />
      </v-row>
    </template>
  </v-img>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import { BeatsaverBeatmap, isBeatsaverBeatmap } from '@/libraries/net/beatsaver/BeatsaverBeatmap';
import { BeatmapLocal, isBeatmapLocal } from '@/libraries/beatmap/BeatmapLocal';
import BeatmapLoader from '@/libraries/beatmap/BeatmapLoader';
import BeatsaverUtilities from '@/libraries/net/beatsaver/BeatsaverUtilities';

export default Vue.extend({
  name: 'BeatmapCover',
  props: {
    beatmap: { type: Object as PropType<BeatsaverBeatmap | BeatmapLocal>, default: {} },
    progressSize: { type: Number, default: undefined },
    gradient: { type: String, default: undefined },
  },
  data: () => ({
    imageSrc: undefined as string | undefined,
  }),
  watch: {
    async beatmap() {
      this.UpdateCover();
    },
  },
  mounted(): void {
    this.UpdateCover();
  },
  methods: {
    async UpdateCover() {
      this.imageSrc = undefined;

      if (isBeatmapLocal(this.beatmap)) {
        this.imageSrc = await BeatmapLoader.LoadCover(this.beatmap);
      }

      if (isBeatsaverBeatmap(this.beatmap)) {
        this.imageSrc = BeatsaverUtilities.GetImageSrcFrom(this.beatmap);
      }
    },
  },
});
</script>

<style scoped>

</style>
