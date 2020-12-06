<template>
  <v-btn
    :disabled="isScanning || installationPath === '' || isRateLimited"
    :loading="isScanning"
    :color="color"
    :small="small"
    :text="text"
    class="my-2"
    @click="scan()"
  >
    <slot>
      Update library
    </slot>
  </v-btn>
</template>

<script lang="ts">
import Vue from "vue";
import { get } from "vuex-pathify";
import ScannerService from "@/libraries/scanner/ScannerService";
import NotificationServiceScanner from "@/libraries/notification/NotificationServiceScanner";

export default Vue.extend({
  name: "ScanAllButton",
  props: {
    small: { type: Boolean, default: false },
    text: { type: Boolean, default: false },
    color: { type: String, default: undefined },
  },
  data: () => ({
    isScanning: false,
    isRateLimited: false,
  }),
  computed: {
    installationPath: get<string>("settings/installationPath"),
    rateLimitResetDate: get<Date | undefined>("appState/beatsaverRateLimit"),
  },
  mounted(): void {
    ScannerService.onScanningStateUpdate(this.onScanningStateUpdate);
    setInterval(() => {
      this.isRateLimited = this.IsRateLimited();
    }, 1000);
  },
  beforeDestroy(): void {
    ScannerService.offScanningStateUpdate(this.onScanningStateUpdate);
  },
  methods: {
    onScanningStateUpdate() {
      this.isScanning = ScannerService.isScanning;
    },
    scan() {
      ScannerService.ScanAll();
      ScannerService.requestDialogToBeOpened();
      NotificationServiceScanner.notifyOnNextScan();
    },
    IsRateLimited() {
      if (this.rateLimitResetDate === undefined) return false;
      return this.rateLimitResetDate > new Date();
    },
  },
});
</script>
