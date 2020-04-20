<template>
  <v-row>
    <v-col
      sm="8"
      cols="10"
    >
      <BeatmapsTableColumnSelector
        :value="shownColumn"
        @input="$emit('update:shownColumn', $event)"
      />
    </v-col>
    <v-col
      sm="4"
      cols="2"
    >
      <BeatmapsTableSearchInput
        :value="search"
        @input="$emit('update:search', $event)"
      />
    </v-col>
  </v-row>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import BeatmapsTableColumnSelector
  from '@/components/beatmap/table/core/BeatmapsTableColumnSelector.vue';
import BeatmapsTableSearchInput from '@/components/beatmap/table/core/BeatmapsTableSearchInput.vue';

export default Vue.extend({
  name: 'BeatmapsTableOuterHeader',
  components: { BeatmapsTableColumnSelector, BeatmapsTableSearchInput },
  props: {
    shownColumn: { type: Array as PropType<string[]>, required: true },
    search: { type: String, required: true },
  },
});
</script>

<style scoped>

</style>
