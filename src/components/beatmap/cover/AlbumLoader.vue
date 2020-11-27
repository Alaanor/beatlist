<template>
  <v-icon v-if="imageSrc === 'error'">
    not_interested
  </v-icon>
  <v-img
    v-else
    :src="imageSrc"
    :gradient="gradient"
    alt="Beatmap cover"
    :contain="contain"
    :width="width"
    :height="height"
    :min-width="minWidth"
    :min-height="minHeight"
    :max-width="maxWidth"
    :max-height="maxHeight"
    @error="imageSrc = 'error'"
  >
    <slot />
    <template v-slot:placeholder>
      <v-row class="fill-height ma-0" align="center" justify="center">
        <v-progress-circular indeterminate :size="progressSize" color="grey" />
      </v-row>
    </template>
  </v-img>
</template>

<script lang="ts">
import Vue, { PropType } from "vue";
import {
  BeatsaverBeatmap,
  isBeatsaverBeatmap,
} from "@/libraries/net/beatsaver/BeatsaverBeatmap";
import { Beatmap, isBeatmapLocal } from "@/libraries/beatmap/Beatmap";
import BeatmapLoader from "@/libraries/beatmap/BeatmapLoader";
import BeatsaverUtilities from "@/libraries/net/beatsaver/BeatsaverUtilities";

export default Vue.extend({
  name: "AlbumLoader",
  props: {
    beatmap: {
      type: Object as PropType<BeatsaverBeatmap | Beatmap>,
      default: {},
    },
    progressSize: { type: Number, default: undefined },
    gradient: { type: String, default: undefined },
    contain: { type: Boolean, default: undefined },
    width: { type: String, default: undefined },
    height: { type: String, default: undefined },
    minWidth: { type: String, default: undefined },
    minHeight: { type: String, default: undefined },
    maxWidth: { type: String, default: undefined },
    maxHeight: { type: String, default: undefined },
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
