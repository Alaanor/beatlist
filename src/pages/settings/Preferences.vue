<template>
  <v-container fluid>
    <p class="display-1">
      Preferences
    </p>
    <v-switch
      v-model="darkTheme"
      dense
      color="accent"
      label="Dark theme"
      messages="Use the dark theme."
    />
    <v-switch
      v-model="miniVariant"
      dense
      color="accent"
      label="Mini sidebar"
      messages="Use the miniature variant of the sidebar."
    />
    <v-switch
      v-model="menuRight"
      dense
      color="accent"
      label="Right menu."
      messages="Place the meny on the right hand side of the application."
    />
    <v-switch
      v-model="enableDiscordRichPresence"
      dense
      color="accent"
      label="Enable Discord Rich Presence"
      messages="Enables the Discord Rich Presence which provides information that pops up on your
        Discord profile."
    />
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue';
import { sync } from 'vuex-pathify';

export default Vue.extend({
  name: 'Preferences',
  computed: {
    enableDiscordRichPresence: sync('settings/enableDiscordRichPresence'),
    darkTheme: sync('settings/darkTheme'),
    miniVariant: sync('settings/miniVariant'),
    menuRight: sync('settings/menuRight'),
  },
});
</script>

<style scoped>

</style>
