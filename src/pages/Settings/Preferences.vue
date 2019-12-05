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
        />
      </v-col>
    </v-row>
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
  },
});
</script>

<style scoped>

</style>
