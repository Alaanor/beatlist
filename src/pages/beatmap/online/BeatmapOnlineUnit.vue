import { BeatSaverAPIResponseStatus } from '../../../libraries/net/beatsaver/BeatsaverAPI';
<template>
  <v-container>
    <v-row>
      <v-col
        cols="auto"
        align-self="center"
      >
        <v-btn
          icon
          @click="backHistory"
        >
          <v-icon>chevron_left</v-icon>
        </v-btn>
      </v-col>
      <v-col cols="auto">
        <p class="display-2 my-0">
          Beatmap information
        </p>
      </v-col>
    </v-row>

    <BeatmapSummary
      v-if="beatmap"
      :beatmap="beatmap.onlineData"
    />
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue';
import BeatmapSummary from '@/components/beatmap/info/BeatmapSummary.vue';
import { BeatmapLocal } from '@/libraries/beatmap/BeatmapLocal';
import BeatsaverAPI, { BeatSaverAPIResponse, BeatSaverAPIResponseStatus } from '@/libraries/net/beatsaver/BeatsaverAPI';
import { BeatsaverBeatmap } from '@/libraries/net/beatsaver/BeatsaverBeatmap';

export default Vue.extend({
  name: 'BeatmapOnlineUnit',
  components: { BeatmapSummary },
  data: () => ({
    beatmap: undefined as BeatmapLocal | undefined,
    loading: false,
    error: undefined as string | undefined,
  }),
  watch: {
    $route() {
      this.fetchData();
    },
  },
  mounted(): void {
    this.fetchData();
  },
  methods: {
    fetchData(): void {
      this.loading = true;
      BeatsaverAPI.Singleton.getBeatmapByKey(this.$route.params.key)
        .then((response: BeatSaverAPIResponse<BeatsaverBeatmap>) => {
          if (response.status === BeatSaverAPIResponseStatus.ResourceFound) {

          }
        })
        .finally(() => {
          this.loading = false;
        });
    },
    backHistory(): void {
      this.$router.go(-1);
    },
  },
});
</script>

<style scoped>

</style>
