<template>
  <v-container>
    <p class="display-1">
      Preferences
    </p>
    <v-row>
      <v-col
        cols="4"
        class="pa-0"
      >
        <v-switch
          v-model="darkTheme"
          color="primary"
          label="Dark theme"
          inset
        />
      </v-col>
      <v-col
        cols="4"
        class="pa-0"
      >
        <v-switch
          v-model="miniVariant"
          color="primary"
          label="Mini sidebar"
          inset
        />
      </v-col>
      <v-col
        cols="4"
        class="pa-0"
      >
        <v-switch
          v-model="enableDiscordRichPresence"
          color="primary"
          label="Enable Discord Rich Presence"
          inset
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue';
import { sync } from 'vuex-pathify';
import DiscordRichPresence from '../../libraries/ipc/DiscordRichPresence';

export default Vue.extend({
  name: 'Preferences',
  computed: {
    enableDiscordRichPresence: sync<boolean>('settings/enableDiscordRichPresence'),
    darkTheme: sync<boolean>('settings/darkTheme'),
    miniVariant: sync<boolean>('settings/miniVariant'),
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
