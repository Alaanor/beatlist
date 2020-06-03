<template>
  <v-text-field
    :value="value"
    solo
    full-width
    dense
    hide-details
    append-icon="search"
    clearable
    @input="$emit('input', $event || '')"
    @click:clear="$emit('input', '')"
  />
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "BeatmapsTableSearchInput",
  props: {
    value: { type: String, required: true },
  },
});
</script>
