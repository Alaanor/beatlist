<template>
  <div>
    <div v-if="lastScan" class="d-flex flex-row align-center">
      <v-icon color="success" class="pr-4">
        check
      </v-icon>
      <div>
        The last library scan has been done the <br />
        <span class="text--disabled caption">{{
          lastScan && lastScan.toLocaleString()
        }}</span>
      </div>
    </div>
    <div v-else class="d-flex flex-row align-center">
      <v-icon color="warning" class="pr-4">
        report_problem
      </v-icon>
      <div>
        You should now scan for all the beatmap and playlist in your
        installation <br />
        <ScanAllButton />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { get } from "vuex-pathify";
import ScanAllButton from "@/components/scanner/ScanAllButton.vue";

export default Vue.extend({
  name: "NewUserModalScanContent",
  components: {
    ScanAllButton,
  },
  computed: {
    lastScan: get<Date | undefined>("beatmap/lastScan"),
  },
});
</script>
