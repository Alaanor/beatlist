<template>
  <span>
    <NotificationService/>
    <TypescriptServicesLauncher/>
    <ScannerStatusService/>
  </span>
</template>

<script>
import Vue from 'vue';
import TypescriptServicesLauncher from '@/components/services/TypescriptServicesLauncher.vue';
import NotificationService from '../services/NotificationService.vue';
import ScannerStatusService from '../services/ScannerStatusService.vue';

export default Vue.extend({
  name: 'AppServices',
  components: {
    TypescriptServicesLauncher,
    NotificationService,
    ScannerStatusService,
  },
});
</script>

<style scoped>

</style>
