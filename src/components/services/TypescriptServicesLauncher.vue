<template>
  <div />
</template>

<script lang="ts">
import Vue from "vue";
import { get } from "vuex-pathify";
import DiscordRichPresence from "@/libraries/ipc/DiscordRichPresence";
import AutoScanLibHandler from "@/libraries/scanner/AutoScanLibHandler";
import NotificationServiceScanner from "@/libraries/notification/NotificationServiceScanner";
import UpgradeCheckerService from "@/libraries/app/UpgradeCheckerService";
import DownloadManager from "@/libraries/net/downloader/DownloadManager";

export default Vue.extend({
  name: "TypescriptServicesLauncher",
  computed: {
    enableDiscordRichPresence: get<boolean>(
      "settings/enableDiscordRichPresence"
    ),
  },
  mounted(): void {
    this.LaunchServices();
  },
  methods: {
    LaunchServices() {
      this.DiscordRichPresence();

      AutoScanLibHandler.register();
      NotificationServiceScanner.Initialize();
      UpgradeCheckerService.Initialize();
      DownloadManager.Initialize();
    },
    DiscordRichPresence() {
      DiscordRichPresence.SetVisibility(this.enableDiscordRichPresence);
    },
  },
});
</script>
