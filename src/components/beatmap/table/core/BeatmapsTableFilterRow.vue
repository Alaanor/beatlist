<template>
  <tr>
    <td
      v-for="header in headers"
      :key="header.value"
      :align="header.align"
    >
      <component
        :is="`BeatmapsTableFilter${header.filterType}`"
        v-if="header.filterType !== undefined"
        v-model="filtersValue[header.value]"
        :header="header"
      />
    </td>
  </tr>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import { BeatmapsTableHeader } from '@/components/beatmap/table/core/BeatmapsTableHeaders';
import BeatmapsTableFilterText from '@/components/beatmap/table/core/filter/BeatmapsTableFilterText.vue';
import BeatmapsTableFilterRange from '@/components/beatmap/table/core/filter/BeatmapsTableFilterRange.vue';
import BeatmapsTableFilterDifficulties from '@/components/beatmap/table/core/filter/BeatmapsTableFilterDifficulties.vue';
import BeatmapsTableFilterDate from '@/components/beatmap/table/core/filter/BeatmapsTableFilterDate.vue';

export default Vue.extend({
  name: 'BeatmapsTableFilterRow',
  components: {
    BeatmapsTableFilterText,
    BeatmapsTableFilterRange,
    BeatmapsTableFilterDifficulties,
    BeatmapsTableFilterDate,
  },
  props: {
    headers: { type: Array as PropType<BeatmapsTableHeader[]>, required: true },
    filtersValue: { type: Object, required: true },
  },
});
</script>

<style scoped>

</style>
