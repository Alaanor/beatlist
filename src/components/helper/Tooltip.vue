<template>
  <v-tooltip
    :top="top && !(right || left || bottom)"
    :left="left"
    :right="right"
    :bottom="bottom"
  >
    <template #activator="{ on }">
      <span v-on="on">
        <slot />
      </span>
    </template>
    <span v-html="text" />
  </v-tooltip>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "Tooltip",
  props: {
    text: { type: String, required: true },
    top: { type: Boolean, default: true },
    bottom: { type: Boolean, default: false },
    left: { type: Boolean, default: false },
    right: { type: Boolean, default: false },
  },
});
</script>
