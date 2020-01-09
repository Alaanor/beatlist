<template>
  <Tooltip :text="`${item.data.metadata.songName} - ${item.data.metadata.songSubName}`">
    <span>
      {{ item.data.metadata.songName }}
      <span class="caption grey--text">
        {{ item.data.metadata.songSubName }}
      </span>
    </span>
  </Tooltip>
</template>

<script lang="ts">
import Vue from 'vue';
import Tooltip from '@/components/helper/Tooltip.vue';

export default Vue.extend({
  name: 'BeatmapTableTemplateBeatmapName',
  components: { Tooltip },
  props: {
    item: { type: Object, required: true },
  },
});
</script>

<style scoped>

</style>
