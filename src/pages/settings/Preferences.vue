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
      dense
      inset
    />
    <v-switch
      v-model="enableDiscordRichPresence"
      color="accent"
      label="Discord Rich Presence"
      dense
      inset
    />
    <p class="title pt-5">
      Playlists
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
    <p class="title pt-5">Beatsaver</p>
    <v-select
      v-model="beatsaverServerUrl"
      :items="beatsaverUrlList"
      class="pt-7"
      color="accent"
      label="Beatsaver server url"
      messages="Where the request are made. This allow the usage of mirror server."
      dense
      inset
      @change="updateServerUrl"
    />
    <p v-if="isBeatSaverPlus()" class="warning--text caption">
      Be aware that BeatSaberPlus is an unofficial mirror of Beatsaver.
    </p>
    <OneClickSettings />
    <p class="title pt-5">
      Accessibility
    </p>
    <v-switch
      v-model="showLetterInDifficulty"
      color="accent"
      label="Show text in difficulty label"
      messages="This will show a letter in difficulty label to make it easier to distinguish them."
      dense
      inset
    />
    <v-select
      v-model="colorBlindMode"
      :items="colorBlindModeList"
      class="pt-7"
      color="accent"
      label="Colorblind mode"
      messages="This changes the way color is shown on difficulty labels"
      dense
      inset
    />
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import { sync } from "vuex-pathify";
import DiscordRichPresence from "@/libraries/ipc/DiscordRichPresence";
import PlaylistFormatType from "@/libraries/playlist/PlaylistFormatType";
import OneClickSettings from "@/pages/settings/components/OneClickSettings.vue";
import { ColorblindMode } from "@/libraries/app/Colorblind";
import BeatsaverAPI from "@/libraries/net/beatsaver/BeatsaverAPI";
import BeatsaverServerUrl from "@/libraries/net/beatsaver/BeatsaverServerUrl";

export default Vue.extend({
  name: "Preferences",
  components: { OneClickSettings },
  computed: {
    enableDiscordRichPresence: sync<boolean>(
      "settings/enableDiscordRichPresence"
    ),
    darkTheme: sync<boolean>("settings/darkTheme"),
    installationPathValid: sync<boolean>("settings/installationPathValid"),
    beatsaverServerUrl: sync<BeatsaverServerUrl>("settings/beatsaverServerUrl"),
    defaultExportFormat: sync<PlaylistFormatType>(
      "settings/defaultExportFormat"
    ),
    showLetterInDifficulty: sync<boolean>(
      "settings/accessibility@showLetterInDifficulty"
    ),
    colorBlindMode: sync<ColorblindMode>(
      "settings/accessibility@colorBlindMode"
    ),
    colorBlindModeList: () =>
      Object.entries(ColorblindMode).map((entry) => ({
        text: entry[0],
        value: entry[1],
      })),
    exportFormatList: () =>
      Object.values(PlaylistFormatType).filter(
        (format) =>
          ![PlaylistFormatType.Unset, PlaylistFormatType.Blist].includes(format)
      ),
    beatsaverUrlList: () =>
      Object.entries(BeatsaverServerUrl).map((entry) => ({
        text: `${entry[0]} (${entry[1]})`,
        value: entry[1],
      })),
  },
  watch: {
    enableDiscordRichPresence() {
      DiscordRichPresence.SetVisibility(this.enableDiscordRichPresence);
    },
  },
  methods: {
    isBeatSaverPlus() {
      return this.beatsaverServerUrl === BeatsaverServerUrl.BeatSaberPlus;
    },
    updateServerUrl() {
      BeatsaverAPI.Singleton.updateBaseUrl(this.beatsaverServerUrl);
    },
  },
});
</script>
