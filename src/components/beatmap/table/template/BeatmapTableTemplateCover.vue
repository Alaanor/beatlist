<template>
  <BeatmapCover
    :beatmap="item.local || item.data"
    :avatar-size="24"
    :icon-expand-size="16"
  />
</template>

<script lang="ts">
import Vue from 'vue';
import BeatmapCover from '@/components/beatmap/BeatmapCover.vue';

export default Vue.extend({
  name: 'BeatmapTableTemplateCover',
  components: { BeatmapCover },
  props: {
    item: { type: Object, required: true },
  },
});
</script>

<style scoped>

</style>
