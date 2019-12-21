<template>
  <v-container fluid>
    <p class="display-1">
      Preferences
    </p>
    <v-switch
      v-model="darkTheme"
      color="accent"
      label="Dark theme"
      messages="Use the dark theme."
      dense
      inset
    />
    <v-switch
      v-model="miniVariant"
      color="accent"
      label="Mini sidebar"
      messages="Use the miniature variant of the sidebar."
      dense
      inset
    />
    <v-switch
      v-model="menuRight"
      color="accent"
      label="Right menu."
      messages="Place the menu on the right hand side of the application."
      dense
      inset
    />
    <v-switch
      v-model="enableDiscordRichPresence"
      color="accent"
      label="Enable Discord Rich Presence"
      messages="Enables the Discord Rich Presence which provides information that pops up on your
        Discord profile."
      dense
      inset
    />
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue';
import { sync } from 'vuex-pathify';
import DiscordRichPresence from '@/libraries/ipc/DiscordRichPresence';

export default Vue.extend({
  name: 'Preferences',
  computed: {
    enableDiscordRichPresence: sync<boolean>('settings/enableDiscordRichPresence'),
    darkTheme: sync<boolean>('settings/darkTheme'),
    miniVariant: sync<boolean>('settings/miniVariant'),
    menuRight: sync<boolean>('settings/menuRight'),
    installationPathValid: sync<boolean>('settings/installationPathValid'),
  },
  watch: {
    enableDiscordRichPresence() {
      DiscordRichPresence.SetVisibility(this.enableDiscordRichPresence);
    },
  },
});
</script>

<style scoped>

</style>
