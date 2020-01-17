<template>
  <div>
    <v-hover #default="{ hover }">
      <v-avatar
        :size="avatarSize"
        class="my-1"
      >
        <BeatmapCover
          :beatmap="beatmap"
          :progress-size="avatarSize"
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
        </BeatmapCover>
      </v-avatar>
    </v-hover>
    <v-overlay
      :value="imageOverlay"
      class="text-center"
      opacity="0.7"
      @click="imageOverlay = false"
    >
      <BeatmapCover :beatmap="beatmap"/>
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
import { BeatsaverBeatmap } from '@/libraries/net/beatsaver/BeatsaverBeatmap';
import { BeatmapLocal } from '@/libraries/beatmap/BeatmapLocal';
import BeatmapCover from '@/components/beatmap/cover/BeatmapCover.vue';

export default Vue.extend({
  name: 'BeatmapCoverAvatar',
  components: { BeatmapCover },
  props: {
    beatmap: { type: Object as PropType<BeatsaverBeatmap | BeatmapLocal>, default: {} },
    avatarSize: { type: Number, default: undefined },
    iconExpandSize: { type: Number, default: undefined },
  },
  data: () => ({
    imageOverlay: false,
  }),
});
</script>

<style scoped>

</style>
