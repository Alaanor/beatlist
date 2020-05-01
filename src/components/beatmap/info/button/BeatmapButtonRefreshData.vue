<template>
  <Tooltip text="Refresh the data">
    <v-btn icon :loading="loading" @click="refreshData">
      <v-icon>refresh</v-icon>
    </v-btn>
  </Tooltip>
</template>

<script lang="ts">
import Vue, { PropType } from "vue";
import { BeatsaverBeatmap } from "@/libraries/net/beatsaver/BeatsaverBeatmap";
import Tooltip from "@/components/helper/Tooltip.vue";
import NotificationService from "@/libraries/notification/NotificationService";
import BeatsaverCacheManager from "@/libraries/beatmap/repo/BeatsaverCacheManager";

export default Vue.extend({
  name: "BeatmapButtonRefreshData",
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
      const response = await BeatsaverCacheManager.updateOne(this.beatmap.hash);

      if (response.success) {
        NotificationService.NotifyMessage(
          "The data has been refreshed",
          "success"
        );
      } else {
        NotificationService.NotifyMessage(
          `Couldn't update the data, reason: "${response.errMsg}"`,
          "warning"
        );
      }

      this.loading = false;
    },
  },
});
</script>

<style scoped></style>
