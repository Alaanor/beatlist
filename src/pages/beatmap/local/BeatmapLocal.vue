<template>
  <v-container>
    <p class="display-2">
      Beatmap Local
    </p>
    <BeatmapsTableLocal/>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue';
import BeatmapsTableLocal from '@/components/beatmap/table/BeatmapsTableLocal.vue';

export default Vue.extend({
  name: 'BeatmapLocal',
  components: { BeatmapsTableLocal },
});
</script>

<style scoped>

</style>
