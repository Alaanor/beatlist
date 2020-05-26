<template>
  <v-container>
    <transition name="slide-x-transition" mode="out-in">
      <keep-alive>
        <router-view />
      </keep-alive>
    </transition>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "Beatmap",
});
</script>

<style scoped></style>
