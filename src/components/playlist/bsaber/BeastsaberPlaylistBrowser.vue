<template>
  <v-container>
    {{ playlist }}
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import BeastsaberAPI from "@/libraries/net/bsaber/BeastsaberAPI";
import BeastsaberPlaylist from "@/libraries/net/bsaber/BeastsaberPlaylist";
import { BeastsaberAPIResponseStatus } from "@/libraries/net/bsaber/BeastsaberAPIResponse";

export default Vue.extend({
  name: "BeastsaberPlaylistBrowser",
  data() {
    return {
      loading: true,
      playlist: [] as BeastsaberPlaylist[],
      error: undefined as string | undefined,
    };
  },
  mounted(): void {
    this.loading = true;
    this.loadPlaylist().then(() => {
      this.loading = false;
    });
  },
  methods: {
    async loadPlaylist() {
      const apiResponse = await BeastsaberAPI.Singleton.GetPlaylists();
      switch (apiResponse.status) {
        case BeastsaberAPIResponseStatus.Success:
          this.playlist = apiResponse.data;
          break;

        case BeastsaberAPIResponseStatus.Failed:
          this.error = apiResponse.error;
          break;

        default:
          this.error = "Unexpected error";
      }
    },
  },
});
</script>

<style scoped></style>
