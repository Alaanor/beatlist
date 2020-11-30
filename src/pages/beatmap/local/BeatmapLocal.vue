<template>
  <v-container>
    <p class="display-2">
      Saved Beatmaps
    </p>
    <BeatmapsTableLocal />
    <p>
      Search tips:
    </p>
    <ul>
      <li>@name:Shake it off</li>
      <li>@artist:Taylor Swift</li>
      <li>@mapper:Leviathan</li>
      <li>@diff:easy|expertPlus</li>
      <li>@dl:200-</li>
      <li>@plays:-4</li>
      <li>@up:100-125</li>
      <li>@down:150-</li>
      <li>@rating:24-25</li>
      <li>@uploaded:2020</li>
      <li>@key:li96</li>
      <li>@hash:25ef</li>
    </ul>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import BeatmapsTableLocal from "@/components/beatmap/table/BeatmapsTableLocal.vue";
import DiscordRichPresence from "@/libraries/ipc/DiscordRichPresence";
import BeatmapLibrary from "@/libraries/beatmap/BeatmapLibrary";

export default Vue.extend({
  name: "BeatmapLocal",
  components: { BeatmapsTableLocal },
  beforeRouteEnter(to, from, next) {
    const amountOfMap = `${BeatmapLibrary.GetAllValidMap().length} beatmaps`;
    DiscordRichPresence.UpdateStatus("Browsing local map", amountOfMap);
    next();
  },
});
</script>
