<template>
  <div />
</template>

<script lang="ts">
import Vue from "vue";
import { ipcRenderer, IpcRendererEvent } from "electron";
import {
  ON_BEATSAVER_LINK_OPENER_COMPONENT_READY,
  OPEN_BEATSAVER_LINK,
} from "@/libraries/ipc/BeatsaverLinkOpener";
import BeatsaverCacheManager from "@/libraries/beatmap/repo/BeatsaverCacheManager";
import { BeatsaverKeyType } from "@/libraries/beatmap/repo/BeatsaverKeyType";
import NotificationService, {
  NOTIFICATION_ICON_FAILED,
} from "@/libraries/notification/NotificationService";

export default Vue.extend({
  name: "BeatsaverLinkOpenerService",
  mounted(): void {
    ipcRenderer.on(
      OPEN_BEATSAVER_LINK,
      async (event: IpcRendererEvent, key: string) => {
        const beatsaverItem = await BeatsaverCacheManager.forceGetCacheBeatmap({
          type: BeatsaverKeyType.Key,
          value: key,
        });

        if (beatsaverItem.beatmap) {
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
      }
    );

    ipcRenderer.send(ON_BEATSAVER_LINK_OPENER_COMPONENT_READY);
  },
});
</script>

<style scoped></style>
