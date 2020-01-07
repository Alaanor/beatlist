<template>
  <v-container>
    <p class="display-2">
      Beatmap Local
    </p>
    <BeatmapsTable :beatmaps="beatmaps"/>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue';
import BeatmapLibrary from '@/libraries/beatmap/BeatmapLibrary';
import BeatmapsTable from '@/components/beatmap/table/BeatmapsTable.vue';
import { BeatmapsTableDataUnit } from '@/components/beatmap/table/BeatmapsTableDataUnit';

export default Vue.extend({
  name: 'BeatmapLocal',
  components: { BeatmapsTable },
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
