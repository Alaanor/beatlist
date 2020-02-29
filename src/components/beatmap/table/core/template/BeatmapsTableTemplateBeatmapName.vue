<template>
  <div
    class="text-truncate"
    :style="`width: ${header.width}px`"
  >
    <Tooltip :text="tooltipText">
      {{ item.data.metadata.songName }}
      <span class="caption grey--text">
        {{ item.data.metadata.songSubName }}
      </span>
    </Tooltip>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Tooltip from '@/components/helper/Tooltip.vue';

export default Vue.extend({
  name: 'BeatmapsTableTemplateBeatmapName',
  components: { Tooltip },
  props: {
    item: { type: Object, required: true },
    header: { type: Object, required: true },
  },
  computed: {
    tooltipText(): string {
      let str = this.item.data.metadata.songName;

      if (this.item.data.metadata.songSubName) {
        str += ` - ${this.item.data.metadata.songSubName}`;
      }

      return str;
    },
  },
});
</script>
