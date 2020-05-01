<template>
  <v-container>
    <transition name="slide-x-transition" mode="out-in">
      <router-view />
    </transition>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "Playlists",
});
</script>

<style scoped></style>
