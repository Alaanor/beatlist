<template>
  <div>
    <Tooltip
      text="Scanner"
      right
    >
      <v-btn
        icon
        :loading="isScanning"
        @click="openScannerDialog()"
      >
        <v-icon>find_in_page</v-icon>
      </v-btn>
    </Tooltip>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Tooltip from '@/components/helper/Tooltip.vue';
import ScannerService from '@/libraries/scanner/ScannerService';

export default Vue.extend({
  name: 'ScannerStatusOpenButton',
  components: { Tooltip },
  computed: {
    isScanning(): boolean {
      return ScannerService.isScanning;
    },
  },
  methods: {
    openScannerDialog() {
      ScannerService.requestDialogToBeOpened();
    },
  },
});
</script>

<style scoped>

</style>
