<template>
  <PlaylistThumbnails :item="item" />
</template>

<script lang="ts">
import Vue from "vue";
import PlaylistThumbnails from "@/components/beatmap/PlaylistThumbnails.vue";

export default Vue.extend({
  name: "BeatmapsTableTemplatePlaylists",
  components: { PlaylistThumbnails },
  props: {
    item: { type: Object, required: true },
  },
});
</script>
