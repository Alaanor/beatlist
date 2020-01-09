<template>
  <Tooltip :text="tooltipText(item)">
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
  methods: {
    tooltipText(item: any) {
      return `${item.data.metadata.songName}${item.data.metadata.songSubName ? ' - ' : ''}${item.data.metadata.songSubName}`;
    },
  },
});
</script>

<style scoped>

</style>
