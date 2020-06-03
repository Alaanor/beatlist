<template>
  <Tooltip :text="item.data.stats.rating.toString()">
    <span>
      {{ item.data.stats.rating.toFixed(2) }}
    </span>
  </Tooltip>
</template>

<script lang="ts">
import Vue from "vue";
import Tooltip from "@/components/helper/Tooltip.vue";

export default Vue.extend({
  name: "BeatmapsTableTemplateRating",
  components: { Tooltip },
  props: {
    item: { type: Object, required: true },
  },
});
</script>
