<template>
  <v-container>
    <p class="display-2">
      Settings
    </p>
    <InstallationPathForm/>
    <SongLibrary/>
    <Preferences/>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue';
import Preferences from './Preferences.vue';
import InstallationPathForm from './InstallationPathForm.vue';
import SongLibrary from './SongLibrary.vue';
import DiscordRichPresence from '../../libraries/ipc/DiscordRichPresence';

export default Vue.extend({
  name: 'Settings',
  components: { InstallationPathForm, Preferences, SongLibrary },
  beforeRouteEnter(to, from, next) {
    DiscordRichPresence.UpdateStatus('Settings');
    next();
  },
});
</script>

<style scoped>

</style>
