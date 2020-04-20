<template>
  <v-edit-dialog>
    <v-btn
      icon
      small
      :color="(min === undefined && max === undefined) ? '' : 'success'"
    >
      <v-icon>filter_list</v-icon>
    </v-btn>
    <template v-slot:input>
      <v-text-field
        v-model="min"
        placeholder="from"
        type="number"
        label="from"
        outlined
        class="mt-6"
        clearable
        @click:clear="clearMin"
        @change="update"
      />
      <v-text-field
        v-model="max"
        placeholder="to"
        type="number"
        label="to"
        outlined
        clearable
        @click:clear="clearMax"
        @change="update"
      />
    </template>
  </v-edit-dialog>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import { BeatmapsTableHeader } from '@/components/beatmap/table/core/BeatmapsTableHeaders';
import { Range } from '@/libraries/common/Range';

export default Vue.extend({
  name: 'BeatmapsTableFilterRange',
  props: {
    value: { type: Object as PropType<Range>, required: true },
    header: { type: Object as PropType<BeatmapsTableHeader>, required: true },
  },
  data: () => ({
    min: undefined as number | undefined,
    max: undefined as number | undefined,
  }),
  mounted(): void {
    this.min = this.value.min;
    this.max = this.value.max;
  },
  methods: {
    update() {
      this.setEmptyAsUndefined();
      this.convertNullToUndefined();
      this.$emit('input', { min: this.min, max: this.max } as Range);
    },
    setEmptyAsUndefined() {
      if ((this.min as unknown as string) === '') {
        this.min = undefined;
      }

      if ((this.max as unknown as string) === '') {
        this.max = undefined;
      }
    },
    convertNullToUndefined() {
      if (this.min === null) {
        this.min = undefined;
      }

      if (this.max === null) {
        this.max = undefined;
      }
    },
    clearMin() {
      this.min = undefined;
    },
    clearMax() {
      this.max = undefined;
    },
  },
});
</script>

<style scoped>

</style>
