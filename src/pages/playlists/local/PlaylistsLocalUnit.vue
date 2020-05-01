<template>
  <v-container v-if="playlist">
    <div class="d-flex align-center">
      <PlaylistCoverAvatar
        :playlist="playlist"
        :avatar-size="48"
        class="mr-5"
      />
      <span class="display-1">
        {{ playlist.title }}
        <span v-if="playlist.author" class="grey--text">
          - {{ playlist.author }}
        </span>
      </span>
    </div>
    <PlaylistEditor :playlist="playlist" />
  </v-container>
  <v-container v-else>
    <v-alert text type="warning">
      An error occurred. Couldn't find the playlist in the cache.
    </v-alert>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import { get } from "vuex-pathify";
import { PlaylistLocal } from "@/libraries/playlist/PlaylistLocal";
import PlaylistLibrary from "@/libraries/playlist/PlaylistLibrary";
import PlaylistCoverAvatar from "@/components/playlist/cover/PlaylistCoverAvatar.vue";
import PlaylistEditor from "@/pages/playlists/local/components/PlaylistEditor.vue";

export default Vue.extend({
  name: "PlaylistLocalUnit",
  components: { PlaylistCoverAvatar, PlaylistEditor },
  data: () => ({
    playlist: undefined as PlaylistLocal | undefined,
  }),
  computed: {
    playlists: get<PlaylistLocal[]>("playlist/playlists"),
  },
  watch: {
    $route: {
      handler() {
        this.playlist = PlaylistLibrary.GetByHash(this.$route.params.hash);
      },
      immediate: true,
    },
    playlists() {
      if (!this.playlist?.path) return;

      const hash = PlaylistLibrary.GetByPath(this.playlist.path)?.hash;

      if (!hash) return;

      this.$router.replace({ name: "playlists-local-unit", params: { hash } });
    },
  },
});
</script>
