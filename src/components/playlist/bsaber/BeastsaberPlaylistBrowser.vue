<template>
  <v-container>
    <v-alert v-if="errorPlaylists" type="warning" class="mt-5">
      Couldn't load playlists
      <v-icon>sentiment_dissatisfied</v-icon>
    </v-alert>
    <BeastsaberPlaylistSlider
      v-else
      :playlists="playlists"
      :loading="loading"
      @playlistClick="onPlaylistSelected"
    />
    <BeastsaberPlaylistContent
      :playlist-local="currentPlaylistLocal"
      :playlist-beastsaber="currentPlaylistBeast"
      :progress="progress"
      :error="errorPlaylist"
    />
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import BeastsaberAPI from "@/libraries/net/bsaber/BeastsaberAPI";
import BeastsaberPlaylist from "@/libraries/net/bsaber/BeastsaberPlaylist";
import { BeastsaberAPIResponseStatus } from "@/libraries/net/bsaber/BeastsaberAPIResponse";
import BeastsaberPlaylistSlider from "@/components/playlist/bsaber/BeastsaberPlaylistSlider.vue";
import PlaylistFetcher from "@/libraries/net/playlist/PlaylistFetcher";
import Progress from "@/libraries/common/Progress";
import { PlaylistLocal } from "@/libraries/playlist/PlaylistLocal";
import BeastsaberPlaylistContent from "@/components/playlist/bsaber/BeastsaberPlaylistContent.vue";

export default Vue.extend({
  name: "BeastsaberPlaylistBrowser",
  components: { BeastsaberPlaylistSlider, BeastsaberPlaylistContent },
  data() {
    return {
      loading: true,
      playlists: [] as BeastsaberPlaylist[],
      currentPlaylistBeast: undefined as BeastsaberPlaylist | undefined,
      currentPlaylistLocal: undefined as PlaylistLocal | undefined,
      errorPlaylists: undefined as string | undefined,
      errorPlaylist: undefined as string | undefined,
      progress: undefined as Progress | undefined,
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
      this.errorPlaylists = undefined;
      this.playlists = [];

      const apiResponse = await BeastsaberAPI.Singleton.GetPlaylists();

      switch (apiResponse.status) {
        case BeastsaberAPIResponseStatus.Success:
          this.playlists = apiResponse.data;
          break;

        case BeastsaberAPIResponseStatus.Failed:
          this.errorPlaylists = apiResponse.error;
          break;

        default:
          this.errorPlaylists = "Unexpected error";
      }
    },
    onPlaylistSelected(playlist: BeastsaberPlaylist) {
      this.progress = new Progress();
      this.currentPlaylistBeast = playlist;

      PlaylistFetcher.Fetch(playlist.playlistURL, this.progress)
        .then((pl: PlaylistLocal) => {
          this.progress = undefined;
          this.currentPlaylistLocal = pl;
        })
        .catch((e: Error) => {
          this.errorPlaylist = e.message;
        });
    },
  },
});
</script>

<style scoped></style>
