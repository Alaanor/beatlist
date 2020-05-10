<template>
  <v-container fluid>
    <p class="display-1">
      Preferences
    </p>
    <p class="title">
      Application
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
    <p class="title pt-5">
      Playlist
    </p>
    <v-select
      v-model="defaultExportFormat"
      color="accent"
      :items="exportFormatList"
      label="Playlist export format"
      messages="The default format used to save new playlist."
      dense
      filled
    />
    <OneClickSettings />
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import { sync } from "vuex-pathify";
import DiscordRichPresence from "@/libraries/ipc/DiscordRichPresence";
import PlaylistFormatType from "@/libraries/playlist/PlaylistFormatType";
import OneClickSettings from "@/pages/settings/components/OneClickSettings.vue";

export default Vue.extend({
  name: "Preferences",
  components: { OneClickSettings },
  computed: {
    enableDiscordRichPresence: sync<boolean>(
      "settings/enableDiscordRichPresence"
    ),
    darkTheme: sync<boolean>("settings/darkTheme"),
    installationPathValid: sync<boolean>("settings/installationPathValid"),
    defaultExportFormat: sync<PlaylistFormatType>(
      "settings/defaultExportFormat"
    ),
    exportFormatList: () =>
      Object.values(PlaylistFormatType).filter(
        (format) =>
          ![PlaylistFormatType.Unset, PlaylistFormatType.Blist].includes(format)
      ),
  },
  watch: {
    enableDiscordRichPresence() {
      DiscordRichPresence.SetVisibility(this.enableDiscordRichPresence);
    },
  },
});
</script>

<style scoped></style>
