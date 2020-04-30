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
import DiscordRichPresence from '@/libraries/ipc/DiscordRichPresence';

export default Vue.extend({
  name: 'BeatmapOnline',
  components: { BeatmapsTableOnline },
  beforeRouteEnter(to, from, next) {
    DiscordRichPresence.UpdateStatus('Browsing beatsaver');
    next();
  },
});
</script>

<style scoped>

</style>
