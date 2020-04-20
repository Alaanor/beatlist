<template>
  <div/>
</template>

<script lang="ts">
import Vue from 'vue';
import { ipcRenderer } from 'electron';
import { get } from 'vuex-pathify';
import DiscordRichPresence from '@/libraries/ipc/DiscordRichPresence';
import { ON_BEATSAVER_LINK_OPENER_COMPONENT_READY, OPEN_BEATSAVER_LINK }
  from '@/libraries/ipc/BeatsaverLinkOpener';
import AutoScanLibHandler from '@/libraries/scanner/AutoScanLibHandler';
import NotificationServiceScanner from '@/libraries/notification/NotificationServiceScanner';

export default Vue.extend({
  name: 'TypescriptServicesLauncher',
  computed: {
    enableDiscordRichPresence: get<boolean>('settings/enableDiscordRichPresence'),
  },
  mounted(): void {
    this.LaunchServices();
  },
  methods: {
    LaunchServices() {
      this.DiscordRichPresence();
      this.RegisterBeatsaverLinkListener();
      AutoScanLibHandler.register();
      NotificationServiceScanner.Initialize();
    },
    DiscordRichPresence() {
      DiscordRichPresence.SetVisibility(this.enableDiscordRichPresence);
    },
    RegisterBeatsaverLinkListener() {
      ipcRenderer.on(OPEN_BEATSAVER_LINK, (event: any, key: any) => {
        this.$router.push({ name: 'beatmap', params: { key } });
      });

      ipcRenderer.send(ON_BEATSAVER_LINK_OPENER_COMPONENT_READY);
    },
  },
});
</script>

<style scoped>

</style>
