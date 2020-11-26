<template>
  <DifficultyIcons :diff="data" small short />
</template>

<script lang="ts">
import Vue from "vue";
import Utilities from "@/libraries/helper/Utilities";
import DifficultyIcons from "@/components/beatmap/DifficultyIcons.vue";

export default Vue.extend({
  name: "BeatmapsTableTemplateDifficulties",
  components: { DifficultyIcons },
  props: {
    item: { type: Object, required: true },
    header: { type: Object, required: true },
  },
  computed: {
    data() {
      return Utilities.byIndex(this.item.data, this.header.templateItemAccess);
    },
  },
});
</script>
