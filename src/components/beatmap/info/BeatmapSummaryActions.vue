<template>
  <div class="d-flex align-center">
    <v-subheader>Actions</v-subheader>

    <BeatmapDownloadButton
      :beatmap="beatmap"
    />
    <BeatmapButtonPlaySong
      v-if="isDownloaded"
      :beatmap="beatmap"
    />
    <BeatmapButtonRefreshData
      v-if="isDownloaded"
      :beatmap="beatmap"
    />
    <BeatmapButtonOpenFolder
      v-if="isDownloaded"
      :beatmap="beatmap"
    />
    <BeatmapButtonOpenPreview
      :beatmap="beatmap"
    />
    <BeatmapButtonOpenBeatsaver
      :beatmap="beatmap"
    />
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import { BeatsaverBeatmap } from '@/libraries/net/beatsaver/BeatsaverBeatmap';
import BeatmapDownloadButton from '@/components/downloads/BeatmapDownloadButton.vue';
import BeatmapButtonRefreshData from '@/components/beatmap/info/button/BeatmapButtonRefreshData.vue';
import BeatmapButtonOpenPreview from '@/components/beatmap/info/button/BeatmapButtonOpenPreview.vue';
import BeatmapButtonOpenFolder from '@/components/beatmap/info/button/BeatmapButtonOpenFolder.vue';
import BeatmapButtonOpenBeatsaver from '@/components/beatmap/info/button/BeatmapButtonOpenBeatsaver.vue';
import BeatmapButtonPlaySong from '@/components/beatmap/info/button/BeatmapButtonPlaySong.vue';
import BeatmapLibrary from '@/libraries/beatmap/BeatmapLibrary';

export default Vue.extend({
  name: 'BeatmapSummaryActions',
  components: {
    BeatmapDownloadButton,
    BeatmapButtonOpenBeatsaver,
    BeatmapButtonOpenFolder,
    BeatmapButtonOpenPreview,
    BeatmapButtonRefreshData,
    BeatmapButtonPlaySong,
  },
  props: {
    beatmap: { type: Object as PropType<BeatsaverBeatmap>, required: true },
  },
  computed: {
    isDownloaded() {
      return BeatmapLibrary.HasBeatmap(this.beatmap);
    },
  },
});
</script>

<style scoped>

</style>
