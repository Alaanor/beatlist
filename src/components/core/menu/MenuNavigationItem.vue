<template>
  <div v-if="configValid">
    <Tooltip :text="item.name" right>
      <v-btn :to="item.path" icon exact>
        <v-icon>
          {{ item.icon }}
        </v-icon>
      </v-btn>
    </Tooltip>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { get } from "vuex-pathify";
import Tooltip from "@/components/helper/Tooltip.vue";

export default Vue.extend({
  name: "MenuNavigationItem",
  components: { Tooltip },
  props: {
    item: { type: Object, required: true },
  },
  computed: {
    configValid: get("settings/configValid"),
  },
});
</script>

<style scoped></style>
