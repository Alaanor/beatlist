<template>
  <div />
</template>

<script lang="ts">
import Vue from "vue";
import { ipcRenderer, IpcRendererEvent } from "electron";
import { OPEN_BEATSAVER_LINK } from "@/libraries/ipc/BeatsaverLinkOpener";
import BeatsaverCacheManager from "@/libraries/beatmap/repo/BeatsaverCacheManager";
import { BeatsaverKeyType } from "@/libraries/beatmap/repo/BeatsaverKeyType";
import NotificationService, {
  NOTIFICATION_ICON_FAILED,
} from "@/libraries/notification/NotificationService";
import BeatmapInstaller from "@/libraries/os/beatSaber/installer/BeatmapInstaller";
import { BeatsaverBeatmap } from "@/libraries/net/beatsaver/BeatsaverBeatmap";
import store from "@/plugins/store";
import BeatmapLibrary from "@/libraries/beatmap/BeatmapLibrary";

export default Vue.extend({
  name: "BeatsaverLinkOpenerService",
  mounted(): void {
    ipcRenderer.on(
      OPEN_BEATSAVER_LINK,
      async (event: IpcRendererEvent, key: string) => {
        this.handleOneClick(key);
      }
    );
  },
  methods: {
    async handleOneClick(key: string): Promise<void> {
      const beatsaverItem = await BeatsaverCacheManager.forceGetCacheBeatmap({
        type: BeatsaverKeyType.Key,
        value: key,
      });

      if (beatsaverItem.beatmap) {
        await this.checkForInstall(beatsaverItem.beatmap);

        await this.$router.push({
          name: "beatmaps-online-unit",
          params: { hash: beatsaverItem.beatmap.hash },
        });
      } else {
        NotificationService.NotifyMessage(
          `Failed to find the key ${key} on beatsaver.`,
          "warning",
          NOTIFICATION_ICON_FAILED,
          2500
        );
      }
    },
    async checkForInstall(beatsaverBeatmap: BeatsaverBeatmap): Promise<void> {
      if (!store.getters["settings/oneClick"].downloadOnClick) {
        return;
      }

      if (BeatmapLibrary.HasBeatmap(beatsaverBeatmap)) {
        NotificationService.NotifyMessage("This map is already installed.");
        return;
      }

      BeatmapInstaller.Install(beatsaverBeatmap, (operation) =>
        NotificationService.NotifyBeatmapDownload(operation.result)
      );
    },
  },
});
</script>

<style scoped></style>
