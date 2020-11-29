<template>
  <v-row>
    <v-col sm="8" cols="10">
      <ColumnSelector
        :value="shownColumn"
        @input="$emit('update:shownColumn', $event)"
      />
    </v-col>
    <v-col sm="4" cols="2">
      <SearchBox :value="search" @input="$emit('update:search', $event)" />
    </v-col>
  </v-row>
</template>

<script lang="ts">
import Vue, { PropType } from "vue";
import ColumnSelector from "@/components/beatmap/table/core/ColumnSelector.vue";
import SearchBox from "@/components/beatmap/table/core/SearchBox.vue";

export default Vue.extend({
  name: "BeatmapsTableOuterHeader",
  components: { ColumnSelector, SearchBox },
  props: {
    shownColumn: { type: Array as PropType<string[]>, required: true },
    search: { type: String, required: true },
  },
});
</script>
