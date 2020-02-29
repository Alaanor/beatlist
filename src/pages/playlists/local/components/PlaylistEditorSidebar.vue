<template>
  <Toc :items="items"/>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import Toc from '@/components/toc/Toc.vue';
import { TocItem } from '@/components/toc/TocItem';

export default Vue.extend({
  name: 'PlaylistEditorSidebar',
  components: { Toc },
  props: {
    items: { type: Array as PropType<TocItem[]>, required: true },
  },
});
</script>

<style scoped>

</style>
