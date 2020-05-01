<template>
  <v-container>
    <p class="display-2">
      Settings
    </p>
    <InstallationPathForm />
    <Library />
    <Preferences />
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import DiscordRichPresence from "@/libraries/ipc/DiscordRichPresence";
import Preferences from "./Preferences.vue";
import InstallationPathForm from "./InstallationPathForm.vue";
import Library from "./Library.vue";

export default Vue.extend({
  name: "Settings",
  components: { InstallationPathForm, Preferences, Library },
  beforeRouteEnter(to, from, next) {
    DiscordRichPresence.UpdateStatus("Settings");
    next();
  },
});
</script>

<style scoped></style>
