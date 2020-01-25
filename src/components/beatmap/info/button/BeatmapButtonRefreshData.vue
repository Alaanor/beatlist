<template>
  <Tooltip text="Refresh the data">
    <v-btn
      icon
      :loading="loading"
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
  data: () => ({
    loading: false,
  }),
  methods: {
    async refreshData() {
      this.loading = true;
      const { error } = await BeatmapLocalUtilities.UpdateOnlineDataFor(this.beatmap);

      if (error) {
        NotificationService.NotifyMessage(error, 'error');
      } else {
        NotificationService.NotifyMessage('The data has been refreshed', 'success');
      }

      this.loading = false;
    },
  },
});
</script>

<style scoped>

</style>
