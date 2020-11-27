<template>
  <AlbumImage
    :beatmap="item.local || item.data"
    :avatar-size="24"
    :icon-expand-size="16"
  />
</template>

<script lang="ts">
import Vue from "vue";
import AlbumImage from "@/components/beatmap/cover/AlbumImage.vue";

export default Vue.extend({
  name: "BeatmapsTableTemplateCover",
  components: { AlbumImage },
  props: {
    item: { type: Object, required: true },
  },
});
</script>
