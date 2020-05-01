<template>
  <v-app>
    <AppMenu />
    <AppBar />
    <AppContent />
    <AppServices />
  </v-app>
</template>

<script lang="ts">
import Vue from "vue";
import { get } from "vuex-pathify";
import AppMenu from "@/components/core/AppMenu.vue";
import AppBar from "@/components/core/AppBar.vue";
import AppContent from "@/components/core/AppContent.vue";
import AppServices from "@/components/core/AppServices.vue";

export default Vue.extend({
  name: "App",
  components: {
    AppMenu,
    AppBar,
    AppContent,
    AppServices,
  },
  computed: {
    darkTheme: get("settings/darkTheme"),
  },
  watch: {
    darkTheme() {
      this.$vuetify.theme.dark = this.darkTheme;
    },
  },
  created() {
    this.$vuetify.theme.dark = this.darkTheme;
  },
});
</script>

<style scoped></style>
