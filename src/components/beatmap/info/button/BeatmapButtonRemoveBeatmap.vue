<template>
  <div v-if="!autoHide || (autoHide && localBeatmap)">
    <Tooltip text="Delete the beatmap">
      <v-btn
        icon
        color="error"
        :loading="loading"
        :disabled="!localBeatmap"
        :small="small"
        @click="dialog = true"
      >
        <v-icon :small="small">
          delete_forever
        </v-icon>
      </v-btn>
    </Tooltip>
    <ConfirmDialog
      v-if="localBeatmap"
      :open.sync="dialog"
      title="Delete beatmap"
      action-text="Delete"
      action-color="error"
      :on-action="deleteBeatmap"
    >
      <span
        >You're about to
        <strong>
          <span class="error--text">remove</span>
          {{ beatmap.metadata.songName }}
        </strong>
        ({{ beatmap.key }})
      </span>
      <span class="caption grey--text">{{ localBeatmap.folderPath }}</span>
    </ConfirmDialog>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from "vue";
import Tooltip from "@/components/helper/Tooltip.vue";
import { BeatsaverBeatmap } from "@/libraries/net/beatsaver/BeatsaverBeatmap";
import ConfirmDialog from "@/components/dialogs/ConfirmDialog.vue";
import BeatmapInstaller from "@/libraries/os/beatSaber/installer/BeatmapInstaller";
import BeatmapLibrary from "@/libraries/beatmap/BeatmapLibrary";
import { BeatmapLocal } from "@/libraries/beatmap/BeatmapLocal";
import NotificationService from "@/libraries/notification/NotificationService";

export default Vue.extend({
  name: "BeatmapButtonRemoveBeatmap",
  components: { Tooltip, ConfirmDialog },
  props: {
    beatmap: { type: Object as PropType<BeatsaverBeatmap>, required: true },
    small: { type: Boolean, default: false },
    autoHide: { type: Boolean, default: false },
  },
  data: () => ({
    loading: false,
    dialog: false,
  }),
  computed: {
    localBeatmap(): BeatmapLocal | undefined {
      return BeatmapLibrary.GetMapByHash(this.beatmap.hash);
    },
  },
  methods: {
    deleteBeatmap(): void {
      this.loading = true;
      if (this.localBeatmap) {
        BeatmapInstaller.Uninstall(this.localBeatmap)
          .then(() => {
            NotificationService.NotifyMessage("Map uninstalled", "success");
          })
          .catch((e: Error) => {
            NotificationService.NotifyMessage(
              `Couldn't uninstall the map - ${e.message}`,
              "error"
            );
          })
          .finally(() => {
            this.loading = false;
          });
      } else {
        NotificationService.NotifyMessage(
          "Couldn't find the local beatmap - strange :(",
          "warning"
        );
        this.loading = false;
      }

      this.dialog = false;
    },
  },
});
</script>

<style scoped></style>
