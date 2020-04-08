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
      v-model="enableDiscordRichPresence"
      color="accent"
      label="Enable Discord Rich Presence"
      messages="Enables the Discord Rich Presence which provides information that pops up on your
        Discord profile."
      dense
      inset
    />
    <v-select
      v-model="defaultExportFormat"
      color="accent"
      :items="exportFormatList"
      label="Playlist export format"
      messages="The default format used to save new playlist."
      class="pt-5"
      dense
      filled
    />
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue';
import { sync } from 'vuex-pathify';
import DiscordRichPresence from '@/libraries/ipc/DiscordRichPresence';
import PlaylistFormatType from '@/libraries/playlist/PlaylistFormatType';

export default Vue.extend({
  name: 'Preferences',
  computed: {
    enableDiscordRichPresence: sync<boolean>('settings/enableDiscordRichPresence'),
    darkTheme: sync<boolean>('settings/darkTheme'),
    installationPathValid: sync<boolean>('settings/installationPathValid'),
    defaultExportFormat: sync<PlaylistFormatType>('settings/defaultExportFormat'),
    exportFormatList: () => Object.values(PlaylistFormatType),
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
