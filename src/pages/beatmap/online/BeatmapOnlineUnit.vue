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
      v-if="beatmap && !error"
      :beatmap="beatmap"
    />
    <v-alert
      v-else-if="error"
      type="warning"
      outlined
    >
      {{ error }}
    </v-alert>
    <LoadingPage v-else/>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue';
import BeatmapSummary from '@/components/beatmap/info/BeatmapSummary.vue';
import BeatsaverAPI, { BeatSaverAPIResponse, BeatSaverAPIResponseStatus } from '@/libraries/net/beatsaver/BeatsaverAPI';
import { BeatsaverBeatmap } from '@/libraries/net/beatsaver/BeatsaverBeatmap';
import BeatsaverUtilities from '@/libraries/net/beatsaver/BeatsaverUtilities';
import LoadingPage from '@/components/helper/LoadingPage.vue';

export default Vue.extend({
  name: 'BeatmapOnlineUnit',
  components: { BeatmapSummary, LoadingPage },
  data: () => ({
    beatmap: undefined as BeatsaverBeatmap | undefined,
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
          this.error = BeatsaverUtilities.ErrorToMessage(response);

          if (response.status === BeatSaverAPIResponseStatus.ResourceFound) {
            this.beatmap = response.data;
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
