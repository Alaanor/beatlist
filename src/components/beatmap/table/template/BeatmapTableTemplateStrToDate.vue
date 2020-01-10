<template>
  <Tooltip :text="date.toLocaleString()">
    {{ date.toDateString() }}
  </Tooltip>
</template>

<script lang="ts">
import Vue from 'vue';
import Utilities from '@/libraries/helper/Utilities';
import Tooltip from '@/components/helper/Tooltip.vue';

export default Vue.extend({
  name: 'BeatmapTableTemplateStrToDate',
  components: { Tooltip },
  props: {
    item: { type: Object, required: true },
    header: { type: Object, required: true },
  },
  computed: {
    data() {
      return Utilities.byIndex(this.item.data, this.header.templateItemAccess);
    },
    date() {
      return new Date(this.data);
    },
  },
});
</script>

<style scoped>

</style>
