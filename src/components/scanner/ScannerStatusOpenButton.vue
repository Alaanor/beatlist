<template>
  <div>
    <Tooltip text="Scanner" right>
      <v-btn icon @click="openScannerDialog()">
        <v-icon v-if="scanning" class="fa-spin">autorenew</v-icon>
        <v-icon v-else>find_in_page</v-icon>
      </v-btn>
    </Tooltip>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Tooltip from "@/components/helper/Tooltip.vue";
import ScannerService from "@/libraries/scanner/ScannerService";

export default Vue.extend({
  name: "ScannerStatusOpenButton",
  components: { Tooltip },
  data: () => ({
    scanning: false,
  }),
  mounted(): void {
    ScannerService.onScanStart(this.onScanStart);
    ScannerService.onScanCompleted(this.onScanCompleted);
  },
  beforeDestroy(): void {
    ScannerService.offScanStart(this.onScanStart);
    ScannerService.offScanCompleted(this.onScanCompleted);
  },
  methods: {
    openScannerDialog() {
      ScannerService.requestDialogToBeOpened();
    },
    onScanCompleted() {
      this.scanning = false;
    },
    onScanStart() {
      this.scanning = true;
    },
  },
});
</script>
