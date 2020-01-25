<template>
  <Tooltip text="Refresh the data">
    <v-btn
      icon
      @click="refreshData"
    >
      <v-icon>refresh</v-icon>
    </v-btn>
  </Tooltip>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import { BeatsaverBeatmap } from '@/libraries/net/beatsaver/BeatsaverBeatmap';
import Tooltip from '@/components/helper/Tooltip.vue';
import BeatmapLocalUtilities from '@/libraries/beatmap/BeatmapLocalUtilities';
import NotificationService from '@/libraries/notification/NotificationService';

export default Vue.extend({
  name: 'BeatmapButtonRefreshData',
  components: { Tooltip },
  props: {
    beatmap: { type: Object as PropType<BeatsaverBeatmap>, required: true },
  },
  methods: {
    async refreshData() {
      const { error } = await BeatmapLocalUtilities.UpdateOnlineDataFor(this.beatmap);

      if (error) {
        NotificationService.NotifyMessage(error, 'error');
      }
    },
  },
});
</script>

<style scoped>

</style>
