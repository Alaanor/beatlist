<template>
  <v-container class="pa-0">
    <v-tooltip
      v-for="value in difficulties"
      :key="value.key"
      top
    >
      <template #activator="{ on }">
        <v-chip
          :color="value.color"
          :small="small"
          class="ml-n3"
          v-on="on"
        >
          {{ value.chipName }}
        </v-chip>
      </template>
      <span>{{ value.name }}</span>
    </v-tooltip>
  </v-container>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import { DifficultiesSimple } from '@/libraries/net/beatsaver/BeatsaverBeatmap';

export default Vue.extend({
  name: 'DifficultiesChips',
  props: {
    diff: { type: Object as PropType<DifficultiesSimple>, required: true },
    small: { type: Boolean, default: false },
    short: { type: Boolean, default: false },
  },
  data: () => ({
    difficulties: [] as any,
  }),
  watch: {
    diff: {
      handler() { this.computeDifficulties(); },
      immediate: true,
    },
  },
  methods: {
    computeDifficulties() {
      this.difficulties = Object.entries(this.diff)
        .map(([key, value]) => ({
          name: key,
          enabled: value,
          chipName: this.short ? '' : key,
          color: this.getColorFor(key),
          weight: this.getWeightFor(key),
        }))
        .sort((a: any, b: any) => a.weight - b.weight);

      // to force the v-for to re-render on different state, we create an unique key
      const keyBase = Object.values(this.difficulties)
        .map((d: any) => d.enabled)
        .join();

      this.difficulties = this.difficulties.map((d: any) => {
        d.key = `${keyBase} - ${d.name}`;
        return d;
      }).filter((d: any) => d.enabled);
    },
    getColorFor: (name: string) => {
      switch (name) {
        case 'easy': return 'green';
        case 'normal': return 'blue';
        case 'hard': return 'orange';
        case 'expert': return 'red';
        case 'expertPlus': return 'purple';
        default: return undefined;
      }
    },
    getWeightFor: (name: string) => {
      switch (name) {
        case 'easy': return 1;
        case 'normal': return 2;
        case 'hard': return 3;
        case 'expert': return 4;
        case 'expertPlus': return 5;
        default: return undefined;
      }
    },
  },
});
</script>

<style scoped>

</style>
