<template>
  <span>
    <NotificationService/>
    <TypescriptServicesLauncher/>
  </span>
</template>

<script>
import Vue from 'vue';
import TypescriptServicesLauncher from '@/components/services/TypescriptServicesLauncher.vue';
import NotificationService from '../services/NotificationService.vue';

export default Vue.extend({
  name: 'AppServices',
  components: { TypescriptServicesLauncher, NotificationService },
});
</script>

<style scoped>

</style>
