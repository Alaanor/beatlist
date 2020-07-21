<template>
  <v-container>
    <p class="display-2">
      <!--Couldn't get it small enough lol-->
      Beatmap Online <small><small>via Beatsaver</small></small>
    </p>
    <BeatmapsTableOnline />
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import BeatmapsTableOnline from "@/components/beatmap/table/BeatmapsTableOnline.vue";
import DiscordRichPresence from "@/libraries/ipc/DiscordRichPresence";

export default Vue.extend({
  name: "BeatmapOnline",
  components: { BeatmapsTableOnline },
  beforeRouteEnter(to, from, next) {
    DiscordRichPresence.UpdateStatus("Browsing beatsaver");
    next();
  },
});
</script>
