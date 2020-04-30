<template>
  <v-container/>
</template>

<script lang="ts">
import Vue from 'vue';
import DiscordRichPresence from '@/libraries/ipc/DiscordRichPresence';

export default Vue.extend({
  name: 'PlaylistsBsaber',
  beforeRouteEnter(to, from, next) {
    DiscordRichPresence.UpdateStatus('Browsing online playlist');
    next();
  },
});
</script>

<style scoped>

</style>
