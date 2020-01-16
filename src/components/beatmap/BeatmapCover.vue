<template>
  <div>
    <v-hover #default="{ hover }">
      <v-avatar
        :size="avatarSize"
        class="my-1"
      >
        <v-icon v-if="imageSrc === 'error'">
          not_interested
        </v-icon>
        <v-img
          v-else
          :src="imageSrc"
          alt="Beatmap cover"
          @error="imageSrc = 'error'"
        >
          <transition name="slide-y-transition">
            <div
              v-if="hover"
              class="d-flex fill-height align-center justify-center"
              style="width: 100%; background-color: #000000A0"
            >
              <v-btn icon>
                <v-icon
                  :size="iconExpandSize"
                  @click="imageOverlay = true"
                >
                  zoom_out_map
                </v-icon>
              </v-btn>
            </div>
          </transition>

          <template v-slot:placeholder>
            <v-row
              class="fill-height ma-0"
              align="center"
              justify="center"
            >
              <v-progress-circular
                indeterminate
                :size="avatarSize"
                color="grey"
              />
            </v-row>
          </template>
        </v-img>
      </v-avatar>
    </v-hover>
    <v-overlay
      :value="imageOverlay"
      class="text-center"
      opacity="0.7"
      @click="imageOverlay = false"
    >
      <v-img
        :src="imageSrc"
        alt="Beatmap cover"
        max-width="512"
        max-height="512"
      />
      <v-btn
        icon
        large
        class="mt-2"
        @click="imageOverlay = false"
      >
        <v-icon large>
          mdi-close
        </v-icon>
      </v-btn>
    </v-overlay>
  </div>
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
    avatarSize: { type: Number, default: undefined },
    iconExpandSize: { type: Number, default: undefined },
  },
  data: () => ({
    imageSrc: undefined as string | undefined,
    imageOverlay: false,
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
