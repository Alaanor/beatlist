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
import DiscordRichPresence from '@/libraries/ipc/DiscordRichPresence';
import BeatmapLibrary from '@/libraries/beatmap/BeatmapLibrary';

export default Vue.extend({
  name: 'BeatmapLocal',
  components: { BeatmapsTableLocal },
  beforeRouteEnter(to, from, next) {
    const amountOfMap = `${BeatmapLibrary.GetAllValidMap().length} beatmaps`;
    DiscordRichPresence.UpdateStatus('Browsing local map', amountOfMap);
    next();
  },
});
</script>

<style scoped>

</style>
