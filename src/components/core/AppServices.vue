<template>
  <span>
    <NotificationService />
    <TypescriptServicesLauncher />
    <ScannerStatusService />
    <NewUserModalService />
  </span>
</template>

<script>
import Vue from "vue";
import TypescriptServicesLauncher from "@/components/services/TypescriptServicesLauncher.vue";
import NotificationService from "@/components/services/NotificationService.vue";
import ScannerStatusService from "@/components/services/ScannerStatusService.vue";
import NewUserModalService from "@/components/services/modal/newUser/NewUserModalService.vue";

export default Vue.extend({
  name: "AppServices",
  components: {
    TypescriptServicesLauncher,
    NotificationService,
    ScannerStatusService,
    NewUserModalService,
  },
});
</script>

<style scoped></style>
