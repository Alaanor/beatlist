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
import { BeatmapLocal } from '@/libraries/beatmap/BeatmapLocal';
import BeatmapLibrary from '@/libraries/beatmap/BeatmapLibrary';
import BeatmapSummary from '@/components/beatmap/info/BeatmapSummary.vue';

export default Vue.extend({
  name: 'BeatmapLocalUnit',
  components: { BeatmapSummary },
  data: () => ({
    beatmap: undefined as BeatmapLocal | undefined,
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
      this.beatmap = BeatmapLibrary.GetMapByHash(this.$route.params.hash);
    },
    backHistory(): void {
      this.$router.go(-1);
    },
  },
});
</script>

<style scoped>

</style>
