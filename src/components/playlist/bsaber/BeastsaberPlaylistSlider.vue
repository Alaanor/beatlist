<template>
  <v-slide-group
    class="mt-5"
    show-arrows
    :mandatory="forceSelected"
    center-active
  >
    <v-slide-item
      v-for="pl in playlists"
      :key="pl.playlistURL"
      v-slot:default="{ active, toggle }"
      :disabled="loading"
    >
      <v-skeleton-loader
        type="image, article"
        :loading="loading"
        width="175"
        class="mx-3 pb-4 mb-5"
      >
        <v-card
          width="175"
          :raised="active"
          @click.stop="
            () => {
              toggle();
              showPlaylist(pl);
            }
          "
        >
          <v-img :src="pl.image" width="175" height="175">
            <v-overlay absolute :value="active" :opacity="0.7">
              <v-row class="fill-height" align="center" justify="center">
                <v-scale-transition>
                  <slot v-if="active" :playlist="pl" />
                </v-scale-transition>
              </v-row>
            </v-overlay>
          </v-img>
        </v-card>
      </v-skeleton-loader>
    </v-slide-item>
  </v-slide-group>
</template>

<script lang="ts">
import Vue, { PropType } from "vue";
import BeastsaberPlaylist from "@/libraries/net/bsaber/BeastsaberPlaylist";

export default Vue.extend({
  name: "BeastsaberPlaylistSlider",
  props: {
    playlists: {
      type: Array as PropType<BeastsaberPlaylist[]>,
      required: true,
    },
    loading: { type: Boolean, default: false },
  },
  data: () => ({
    forceSelected: false,
  }),
  methods: {
    showPlaylist(playlist: BeastsaberPlaylist) {
      this.forceSelected = true;
      this.$emit("playlistClick", playlist);
    },
  },
});
</script>

<style scoped></style>
