<template>
  <v-container class="pa-0">
    <v-list-item-avatar class="my-0">
      <BeatmapCover :beatmap="beatmap"/>
    </v-list-item-avatar>
    <v-list-item-content class="py-0">
      <v-list-item-title>{{ beatmap.metadata.songName }}</v-list-item-title>
      <v-list-item-subtitle>{{ }}</v-list-item-subtitle>
    </v-list-item-content>
  </v-container>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import DownloadOperationBeatmap from '@/libraries/net/downloader/operation/beatmap/DownloadOperationBeatmap';
import { BeatsaverBeatmap } from '@/libraries/net/beatsaver/BeatsaverBeatmap';

export default Vue.extend({
  name: 'DownloadsListTemplateBeatmap',
  props: {
    operation: { type: Object as PropType<DownloadOperationBeatmap>, required: true },
  },
  computed: {
    beatmap(): BeatsaverBeatmap {
      return this.operation.beatmap;
    },
  },
});
</script>

<style scoped>

</style>
