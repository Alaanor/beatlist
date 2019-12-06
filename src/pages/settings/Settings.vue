<template>
  <v-container>
    <p class="display-2">
      Settings
    </p>
    <!-- Installation Path + Auto detector -->
    <!-- Song Library + Scanner -->
    <Preferences/>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue';
import Preferences from './Preferences.vue';

export default Vue.extend({
  name: 'Settings',
  components: { Preferences },
});
</script>

<style scoped>

</style>
