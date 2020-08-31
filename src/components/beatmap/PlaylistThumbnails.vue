<template>
  <v-container :class="'pa-0 pl-3'">
    <v-tooltip v-for="value in playlists" :key="value.key" top>
      <template #activator="{ on }">
        <v-chip :v-on="on" color="transparent">
          <PlaylistCoverAvatar
            :playlist="value"
            :avatar-size="24"
            :icon-expand-size="16"
          />
        </v-chip>
      </template>
      <span>{{ value.title }}</span>
    </v-tooltip>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import BeatmapLibrary from "@/libraries/beatmap/BeatmapLibrary";
import { PlaylistLocal } from "@/libraries/playlist/PlaylistLocal";
import PlaylistCoverAvatar from "@/components/playlist/cover/PlaylistCoverAvatar.vue";

export default Vue.extend({
  name: "PlaylistThumbnails",
  components: {
    PlaylistCoverAvatar,
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
