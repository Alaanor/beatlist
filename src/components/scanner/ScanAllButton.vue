<template>
  <v-btn
    :disabled="isScanning || installationPath === ''"
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
import Vue from 'vue';
import { get } from 'vuex-pathify';
import ScannerService from '@/libraries/scanner/ScannerService';
import NotificationServiceScanner from '@/libraries/notification/NotificationServiceScanner';

export default Vue.extend({
  name: 'ScanAllButton',
  props: {
    small: { type: Boolean, default: false },
    text: { type: Boolean, default: false },
    color: { type: String, default: undefined },
  },
  data: () => ({
    isScanning: false,
  }),
  computed: {
    installationPath: get<string>('settings/installationPath'),
  },
  mounted(): void {
    ScannerService.onScanningStateUpdate(this.onScanningStateUpdate);
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
  },
});
</script>

<style scoped>

</style>
