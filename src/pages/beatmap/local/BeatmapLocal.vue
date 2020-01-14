<template>
  <v-container>
    <p class="display-2">
      Beatmap Local
    </p>
    <BeatmapsTableLocal :beatmaps="beatmaps"/>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue';
import BeatmapLibrary from '@/libraries/beatmap/BeatmapLibrary';
import BeatmapsTableLocal from '@/components/beatmap/table/BeatmapsTableLocal.vue';
import { BeatmapsTableDataUnit } from '@/components/beatmap/table/core/BeatmapsTableDataUnit';

export default Vue.extend({
  name: 'BeatmapLocal',
  components: { BeatmapsTableLocal },
  computed: {
    beatmaps: () => BeatmapLibrary.GetAllValidMap()
      .map((beatmap): BeatmapsTableDataUnit => ({
        local: beatmap,
        data: beatmap.onlineData,
      })),
  },
});
</script>

<style scoped>

</style>
