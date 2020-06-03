<template>
  <Tooltip text="New playlist">
    <v-btn icon :loading="loading" @click="MakeNewPlaylist">
      <v-icon>add</v-icon>
    </v-btn>
  </Tooltip>
</template>

<script lang="ts">
import Vue from "vue";
import Tooltip from "@/components/helper/Tooltip.vue";
import PlaylistOperation from "@/libraries/playlist/PlaylistOperation";

export default Vue.extend({
  name: "PlaylistButtonNewPlaylist",
  components: { Tooltip },
  data: () => ({
    loading: false,
  }),
  methods: {
    MakeNewPlaylist() {
      this.loading = true;
      PlaylistOperation.CreateNewPlaylist().then(() => {
        this.loading = false;
      });
    },
  },
});
</script>
