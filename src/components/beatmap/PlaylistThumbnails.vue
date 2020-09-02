<template>
  <v-container class="pa-0 pl-3">
    <v-tooltip v-for="playlist in playlists" :key="playlist.key" top>
      <template #activator="{ on }">
        <v-avatar :size="24" class="mx-1" v-on="on">
          <PlaylistCover
            :playlist="playlist"
            :avatar-size="24"
            :icon-expand-size="16"
            contains
          />
        </v-avatar>
      </template>
      <span>{{ playlist.title }}</span>
    </v-tooltip>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import BeatmapLibrary from "@/libraries/beatmap/BeatmapLibrary";
import { PlaylistLocal } from "@/libraries/playlist/PlaylistLocal";
import PlaylistCover from "@/components/playlist/cover/PlaylistCoverAvatar.vue";

export default Vue.extend({
  name: "PlaylistThumbnails",
  components: {
    PlaylistCover,
  },
  props: {
    item: { type: Object, required: true },
  },
  computed: {
    playlists(): PlaylistLocal[] {
      return BeatmapLibrary.GetPlaylists(this.item.data);
    },
  },
});
</script>
