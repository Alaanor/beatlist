<template>
  <v-edit-dialog>
    <v-btn
      icon
      small
      :color="!isModified() ? '' : 'success'"
    >
      <v-icon>filter_list</v-icon>
    </v-btn>
    <template v-slot:input>
      <v-chip-group
        v-model="selectedValues"
        multiple
      >
        <v-chip
          v-for="diff in difficulties"
          :key="diff.name"
          :value="diff.name"
          :color="selectedValues.includes(diff.name) ? diff.color : ''"
        >
          {{ diff.displayName }}
        </v-chip>
      </v-chip-group>
    </template>
  </v-edit-dialog>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import { BeatmapsTableHeader } from '@/components/beatmap/table/BeatmapsTableHeaders';
import { getNameFor, getColorFor, listOfDifficulties } from '@/components/helper/DifficultiesHelper';

export default Vue.extend({
  name: 'BeatmapsTableFilterDifficulties',
  props: {
    value: { type: Array as PropType<string[]>, required: true },
    header: { type: Object as PropType<BeatmapsTableHeader>, required: true },
  },
  data: () => ({
    selectedValues: [] as string[],
  }),
  computed: {
    difficulties() {
      return listOfDifficulties.map((diff: string) => ({
        name: diff,
        displayName: getNameFor(diff),
        color: getColorFor(diff),
      }));
    },
  },
  watch: {
    selectedValues() {
      this.update();
    },
  },
  mounted(): void {
    this.selectedValues = this.value;
  },
  methods: {
    update() {
      this.$emit('input', this.selectedValues);
    },
    isModified() {
      return !listOfDifficulties.every((diff) => this.selectedValues.includes(diff));
    },
  },
});
</script>

<style scoped>

</style>
