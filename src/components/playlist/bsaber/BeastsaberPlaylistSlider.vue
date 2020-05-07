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
          @click.stop="toggle"
          @click="showPlaylist(pl)"
        >
          <v-img :src="pl.image" width="175" height="175">
            <v-overlay absolute :value="active" :opacity="0.7">
              <v-row class="fill-height" align="center" justify="center">
                <v-scale-transition>
                  <v-btn
                    v-if="active"
                    icon
                    x-large
                    :disabled="isPlaylistDownloaded(pl)"
                  >
                    <v-icon color="success" x-large @click="installPlaylist()">
                      {{ isPlaylistDownloaded(pl) ? "done" : "file_download" }}
                    </v-icon>
                  </v-btn>
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
import PlaylistLibrary from "@/libraries/playlist/PlaylistLibrary";
import { PlaylistLocal } from "@/libraries/playlist/PlaylistLocal";

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
    isPlaylistDownloaded(playlist: BeastsaberPlaylist) {
      PlaylistLibrary.GetAllValidPlaylists().find((p: PlaylistLocal) => {
        return (
          playlist.playlistTitle === p.title &&
          playlist.playlistAuthor === p.author &&
          playlist.playlistDescription === p.description
        );
      });
    },
    installPlaylist() {},
    showPlaylist(playlist: BeastsaberPlaylist) {
      this.forceSelected = true;
      this.$emit("playlistClick", playlist);
    },
  },
});
</script>

<style scoped></style>
