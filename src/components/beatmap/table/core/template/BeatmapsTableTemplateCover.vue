<template>
  <BeatmapCoverAvatar
    :beatmap="item.local || item.data"
    :avatar-size="24"
    :icon-expand-size="16"
  />
</template>

<script lang="ts">
import Vue from 'vue';
import BeatmapCoverAvatar from '@/components/beatmap/cover/BeatmapCoverAvatar.vue';

export default Vue.extend({
  name: 'BeatmapsTableTemplateCover',
  components: { BeatmapCoverAvatar },
  props: {
    item: { type: Object, required: true },
  },
});
</script>

<style scoped>

</style>
