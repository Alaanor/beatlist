<template>
  <div>
    <v-hover #default="{ hover }">
      <v-avatar :size="avatarSize" :tile="tile" class="my-1">
        <AlbumLoader :beatmap="beatmap" :progress-size="avatarSize">
          <transition name="slide-y-transition">
            <div
              v-if="hover"
              class="d-flex fill-height align-center justify-center"
              style="width: 100%; background-color: #000000a0;"
            >
              <v-btn icon>
                <v-icon :size="iconExpandSize" @click="imageOverlay = true">
                  zoom_out_map
                </v-icon>
              </v-btn>
            </div>
          </transition>
        </AlbumLoader>
      </v-avatar>
    </v-hover>
    <v-overlay
      :value="imageOverlay"
      class="text-center"
      opacity="0.7"
      @click="imageOverlay = false"
    >
      <AlbumLoader :beatmap="beatmap" max-height="512" contain />
      <v-btn icon large class="mt-2" @click="imageOverlay = false">
        <v-icon large>
          mdi-close
        </v-icon>
      </v-btn>
    </v-overlay>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from "vue";
import { BeatsaverBeatmap } from "@/libraries/net/beatsaver/BeatsaverBeatmap";
import { Beatmap } from "@/libraries/beatmap/Beatmap";
import AlbumLoader from "@/components/beatmap/cover/AlbumLoader.vue";

export default Vue.extend({
  name: "AlbumImage",
  components: { AlbumLoader },
  props: {
    beatmap: {
      type: Object as PropType<BeatsaverBeatmap | Beatmap>,
      default: {},
    },
    avatarSize: { type: Number, default: undefined },
    iconExpandSize: { type: Number, default: undefined },
    tile: { type: Boolean, default: undefined },
  },
  data: () => ({
    imageOverlay: false,
  }),
});
</script>
