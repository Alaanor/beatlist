<template>
  <Tooltip text="New playlist">
    <v-btn icon @click="openFolder">
      <v-icon>folder</v-icon>
    </v-btn>
  </Tooltip>
</template>

<script lang="ts">
import Vue from "vue";
import { shell } from "electron";
import Tooltip from "@/components/helper/Tooltip.vue";
import BeatSaber from "@/libraries/os/beatSaber/BeatSaber";

export default Vue.extend({
  name: "PlaylistButtonOpenFolder",
  components: { Tooltip },
  methods: {
    openFolder() {
      const folderPath = BeatSaber.getPlaylistFolder();
      shell.openItem(folderPath);
    },
  },
});
</script>

<style scoped></style>
