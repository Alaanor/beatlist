<template>
  <v-container>
    <div class="d-flex align-center flex-column">
      <v-img
        :src="logo"
        height="128"
        width="128"
      />
      <h1 class="display-3 text-center">
        Beatlist
      </h1>
      <div class="text-center grey--text caption">
        Current version: {{ currentVersion }}
      </div>
    </div>
    <ChangelogDisplayer/>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue';
import { remote } from 'electron';
import ChangelogDisplayer from '../components/github/changelog/ChangelogDisplayer.vue';

const logo = require('../assets/logo.png');

export default Vue.extend({
  name: 'Home',
  components: { ChangelogDisplayer },
  computed: {
    logo: () => logo,
    currentVersion() {
      return remote.app.getVersion();
    },
  },
});
</script>

<style scoped>

</style>
