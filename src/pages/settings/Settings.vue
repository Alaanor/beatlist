<template>
  <v-container>
    <p class="display-2">
      Settings
    </p>
    <InstallationPathForm/>
    <!-- Song Library + Scanner -->
    <Preferences/>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue';
import Preferences from './Preferences.vue';
import InstallationPathForm from './InstallationPathForm.vue';

export default Vue.extend({
  name: 'Settings',
  components: { InstallationPathForm, Preferences },
});
</script>

<style scoped>

</style>
