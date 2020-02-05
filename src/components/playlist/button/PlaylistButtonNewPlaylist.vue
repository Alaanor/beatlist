<template>
  <Tooltip text="New playlist">
    <v-btn
      icon
      @click="MakeNewPlaylist"
    >
      <v-icon>add</v-icon>
    </v-btn>
  </Tooltip>
</template>

<script lang="ts">
import Vue from 'vue';
import Tooltip from '@/components/helper/Tooltip.vue';
import PlaylistInstaller from '@/libraries/os/beatSaber/installer/PlaylistInstaller';

export default Vue.extend({
  name: 'PlaylistButtonNewPlaylist',
  components: { Tooltip },
  methods: {
    MakeNewPlaylist() {
      PlaylistInstaller.InstallNewEmpty();
    },
  },
});
</script>

<style scoped>

</style>
