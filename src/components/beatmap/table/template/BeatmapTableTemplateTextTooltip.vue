<template>
  <Tooltip :text="data">
    <span>
      {{ data }}
    </span>
  </Tooltip>
</template>

<script lang="ts">
import Vue from 'vue';
import Utilities from '@/libraries/helper/Utilities';
import Tooltip from '@/components/helper/Tooltip.vue';

export default Vue.extend({
  name: 'BeatmapTableTemplateDefault',
  components: { Tooltip },
  props: {
    item: { type: Object, required: true },
    header: { type: Object, required: true },
  },
  computed: {
    data() {
      return Utilities.byIndex(this.item.data, this.header.templateItemAccess);
    },
  },
});
</script>

<style scoped>

</style>
