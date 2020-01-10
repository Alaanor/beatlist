<template>
  <span>
    {{ item.data.metadata.songName }}
    <span class="caption grey--text">
      {{ item.data.metadata.songSubName }}
    </span>
  </span>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'BeatmapTableTemplateBeatmapName',
  props: {
    item: { type: Object, required: true },
  },
});
</script>

<style scoped>

</style>
