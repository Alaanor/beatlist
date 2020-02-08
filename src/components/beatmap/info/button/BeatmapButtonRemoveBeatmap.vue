<template>
  <div v-if="localBeatmap">
    <Tooltip text="Delete the beatmap">
      <v-btn
        icon
        color="error"
        :loading="loading"
        @click="dialog = true"
      >
        <v-icon>delete_forever</v-icon>
      </v-btn>
    </Tooltip>
    <ConfirmDialog
      :open.sync="dialog"
      title="Delete beatmap"
      action-text="Delete"
      action-color="error"
      :on-action="deleteBeatmap"
    >
      <span>You're about to
        <strong>
          <span class="error--text">remove</span>
          {{ localBeatmap.onlineData.metadata.songName }}
        </strong>
        ({{ localBeatmap.onlineData.key }})
      </span>
      <span class="caption grey--text">{{ localBeatmap.folderPath }}</span>
    </ConfirmDialog>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import Tooltip from '@/components/helper/Tooltip.vue';
import { BeatsaverBeatmap } from '@/libraries/net/beatsaver/BeatsaverBeatmap';
import ConfirmDialog from '@/components/dialogs/ConfirmDialog.vue';
import BeatmapInstaller from '@/libraries/os/beatSaber/installer/BeatmapInstaller';
import BeatmapLibrary from '@/libraries/beatmap/BeatmapLibrary';
import { BeatmapLocal } from '@/libraries/beatmap/BeatmapLocal';
import NotificationService from '@/libraries/notification/NotificationService';

export default Vue.extend({
  name: 'BeatmapButtonRemoveBeatmap',
  components: { Tooltip, ConfirmDialog },
  props: {
    beatmap: { type: Object as PropType<BeatsaverBeatmap>, required: true },
  },
  data: () => ({
    loading: false,
    dialog: false,
  }),
  computed: {
    localBeatmap(): BeatmapLocal | undefined {
      return BeatmapLibrary.GetMapByKey(this.beatmap.key);
    },
  },
  methods: {
    deleteBeatmap(): void {
      this.loading = true;
      if (this.localBeatmap) {
        BeatmapInstaller
          .Uninstall(this.localBeatmap)
          .then(() => {
            NotificationService.NotifyMessage('Map uninstalled', 'success');
          })
          .catch((e: Error) => {
            NotificationService.NotifyMessage(`Couldn't uninstall the map - ${e.message}`, 'error');
          })
          .finally(() => {
            this.loading = false;
          });
      } else {
        NotificationService.NotifyMessage("Couldn't find the local beatmap - strange :(", 'warning');
        this.loading = false;
      }

      this.dialog = false;
    },
  },
});
</script>

<style scoped>

</style>
