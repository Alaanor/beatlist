<template>
  <v-edit-dialog>
    <v-btn icon small :color="textFieldValue === '' ? '' : 'success'">
      <v-icon>filter_list</v-icon>
    </v-btn>
    <template v-slot:input>
      <v-text-field
        v-model="textFieldValue"
        :placeholder="header.text"
        single-line
      />
    </template>
  </v-edit-dialog>
</template>

<script lang="ts">
import Vue, { PropType } from "vue";
import { BeatmapsTableHeader } from "@/components/beatmap/table/core/BeatmapsTableHeaders";

export default Vue.extend({
  name: "BeatmapsTableFilterText",
  props: {
    value: { type: String, required: true },
    header: { type: Object as PropType<BeatmapsTableHeader>, required: true },
  },
  data: () => ({
    textFieldValue: "",
  }),
  watch: {
    textFieldValue() {
      this.update();
    },
  },
  mounted(): void {
    this.textFieldValue = this.value;
  },
  methods: {
    update() {
      this.$emit("input", this.textFieldValue);
    },
  },
});
</script>

<style scoped></style>
