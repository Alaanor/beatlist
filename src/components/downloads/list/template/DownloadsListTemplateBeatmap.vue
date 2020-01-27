<template>
  <v-list-item class="pa-0 my-1">
    <v-list-item-avatar class="my-0">
      <BeatmapCover :beatmap="beatmap"/>
    </v-list-item-avatar>
    <v-list-item-content class="py-0">
      <v-list-item-title>{{ beatmap.metadata.songName }}</v-list-item-title>
      <v-list-item-subtitle v-if="type === 'queued'">
        {{ beatmap.metadata.songAuthorName }}
      </v-list-item-subtitle>
      <v-list-item-subtitle v-else-if="type === 'ongoing'">
        {{ progressText }}
      </v-list-item-subtitle>
      <v-list-item-subtitle v-else-if="type === 'completed'">
        {{ progressTextEnded }}
      </v-list-item-subtitle>
    </v-list-item-content>
    <v-list-item-action/>
  </v-list-item>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import DownloadOperationBeatmap from '@/libraries/net/downloader/operation/beatmap/DownloadOperationBeatmap';
import { BeatsaverBeatmap } from '@/libraries/net/beatsaver/BeatsaverBeatmap';
import BeatmapCover from '@/components/beatmap/cover/BeatmapCover.vue';
import {
  FormatProgressAllInOne,
  FormatProgressSpeed,
  FormatProgressTotal,
} from '@/libraries/net/downloader/DownloadUnitProgress';

export default Vue.extend({
  name: 'DownloadsListTemplateBeatmap',
  components: { BeatmapCover },
  props: {
    operation: { type: Object as PropType<DownloadOperationBeatmap>, required: true },
    type: { type: String as PropType<'queued' | 'ongoing' | 'completed'>, required: true },
  },
  computed: {
    beatmap(): BeatsaverBeatmap {
      return this.operation.beatmap;
    },
    progressText(): string {
      return FormatProgressAllInOne(this.operation.progress);
    },
    progressTextEnded(): string {
      return `${FormatProgressTotal(this.operation.progress)}, Downloaded at ${FormatProgressSpeed(this.operation.progress)}`;
    },
  },
});
</script>

<style scoped>

</style>
