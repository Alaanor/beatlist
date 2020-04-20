<template>
  <v-edit-dialog>
    <v-btn
      icon
      small
      :color="(stringMin === undefined && stringMax === undefined) ? '' : 'success'"
    >
      <v-icon>filter_list</v-icon>
    </v-btn>
    <template v-slot:input>
      <v-menu
        ref="menu"
        v-model="menuMin"
        transition="scale-transition"
        offset-y
        min-width="290px"
      >
        <template v-slot:activator="{ on }">
          <v-text-field
            v-model="stringMin"
            label="From"
            prepend-icon="event"
            readonly
            clearable
            @click:clear="clearMin"
            v-on="on"
          />
        </template>
        <v-date-picker v-model="stringMin"/>
      </v-menu>
      <v-menu
        ref="menu"
        v-model="menuMax"
        transition="scale-transition"
        offset-y
        min-width="290px"
      >
        <template v-slot:activator="{ on }">
          <v-text-field
            v-model="stringMax"
            label="To"
            prepend-icon="event"
            readonly
            clearable
            @click:clear="clearMax"
            v-on="on"
          />
        </template>
        <v-date-picker v-model="stringMax"/>
      </v-menu>
    </template>
  </v-edit-dialog>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import { BeatmapsTableHeader } from '@/components/beatmap/table/core/BeatmapsTableHeaders';
import { DateRange } from '@/libraries/common/Range';

export default Vue.extend({
  name: 'BeatmapsTableFilterDate',
  props: {
    value: { type: Object as PropType<DateRange>, required: true },
    header: { type: Object as PropType<BeatmapsTableHeader>, required: true },
  },
  data: () => ({
    stringMin: undefined as string | undefined,
    stringMax: undefined as string | undefined,
    dateMin: undefined as Date | undefined,
    dateMax: undefined as Date | undefined,
    menuMin: false,
    menuMax: false,
  }),
  watch: {
    stringMin() {
      this.dateMin = this.stringMin !== undefined ? new Date(this.stringMin) : undefined;
      this.update();
    },
    stringMax() {
      this.dateMax = this.stringMax !== undefined ? new Date(this.stringMax) : undefined;
      this.update();
    },
  },
  mounted(): void {
    this.dateMin = this.value.min;
    this.dateMax = this.value.max;
    this.stringMin = this.value.min?.toISOString().substr(0, 10);
    this.stringMax = this.value.max?.toISOString().substr(0, 10);
  },
  methods: {
    update() {
      this.checkForValidMinMax();
      this.convertNullToUndefined();
      this.$emit('input', { min: this.dateMin, max: this.dateMax } as DateRange);
    },
    checkForValidMinMax() {
      if (
        this.dateMin !== undefined
        && this.dateMax !== undefined
        && this.dateMin?.getTime() > this.dateMax?.getTime()
      ) {
        this.dateMax = this.dateMin;
      }
    },
    convertNullToUndefined() {
      if (this.stringMin === null) {
        this.stringMin = undefined;
      }

      if (this.stringMax === null) {
        this.stringMax = undefined;
      }
    },
    clearMin() {
      this.stringMin = undefined;
    },
    clearMax() {
      this.stringMax = undefined;
    },
  },
});
</script>

<style scoped>

</style>
