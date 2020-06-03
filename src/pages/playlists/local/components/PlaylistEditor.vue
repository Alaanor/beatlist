<template>
  <div>
    <PlaylistEditorSidebar :items="menu" />
    <v-container>
      <PlaylistEditorDetails
        id="playlist-details"
        :playlist="playlist"
        @update:playlist="$emit('update:playlist', $event)"
      />
      <PlaylistEditorBeatmapList
        id="playlist-content-list"
        :playlist="playlist"
        class="mb-10"
      />
      <PlaylistEditorBeatmapBrowser
        id="playlist-browser"
        :playlist="playlist"
      />
    </v-container>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from "vue";
import { TocItem } from "@/components/toc/TocItem";
import PlaylistEditorSidebar from "@/pages/playlists/local/components/PlaylistEditorSidebar.vue";
import PlaylistEditorDetails from "@/pages/playlists/local/components/PlaylistEditorDetails.vue";
import { PlaylistLocal } from "@/libraries/playlist/PlaylistLocal";
import PlaylistEditorBeatmapList from "@/pages/playlists/local/components/PlaylistEditorBeatmapList.vue";
import PlaylistEditorBeatmapBrowser from "@/pages/playlists/local/components/PlaylistEditorBeatmapBrowser.vue";

export default Vue.extend({
  name: "PlaylistEditor",
  components: {
    PlaylistEditorSidebar,
    PlaylistEditorDetails,
    PlaylistEditorBeatmapList,
    PlaylistEditorBeatmapBrowser,
  },
  props: {
    playlist: { type: Object as PropType<PlaylistLocal>, required: true },
  },
  data: () => ({
    menu: [
      { name: "Details", sectionId: "playlist-details" },
      { name: "Content", sectionId: "playlist-content-list" },
      { name: "Browser", sectionId: "playlist-browser" },
    ] as TocItem[],
  }),
});
</script>
