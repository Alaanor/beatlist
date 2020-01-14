<template>
  <span>
    {{ data }}
  </span>
</template>

<script lang="ts">
import Vue from 'vue';
import Utilities from '@/libraries/helper/Utilities';

export default Vue.extend({
  name: 'BeatmapsTableTemplateText',
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
