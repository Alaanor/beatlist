<template>
  <v-container>
    <p class="display-2">
      Beatmap Online
    </p>
    <BeatmapsTableOnline/>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue';
import BeatmapsTableOnline from '@/components/beatmap/table/BeatmapsTableOnline.vue';

export default Vue.extend({
  name: 'BeatmapOnline',
  components: { BeatmapsTableOnline },
});
</script>

<style scoped>

</style>
