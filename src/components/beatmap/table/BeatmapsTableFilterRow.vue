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
        v-model="headersFilterValue[header.value]"
        :header="header"
        @input="onUpdate"
      />
    </td>
  </tr>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import { BeatmapsTableHeader, headersFilterValue } from '@/components/beatmap/table/BeatmapsTableHeaders';
import BeatmapsTableFilterText from '@/components/beatmap/table/filter/BeatmapsTableFilterText.vue';
import BeatmapsTableFilterRange from '@/components/beatmap/table/filter/BeatmapsTableFilterRange.vue';
import BeatmapsTableFilterDifficulties from '@/components/beatmap/table/filter/BeatmapsTableFilterDifficulties.vue';
import BeatmapsTableFilterDate from '@/components/beatmap/table/filter/BeatmapsTableFilterDate.vue';

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
  },
  computed: {
    headersFilterValue: () => headersFilterValue,
  },
  methods: {
    onUpdate() {
      this.$emit('forceUpdate');
    },
  },
});
</script>

<style scoped>

</style>
