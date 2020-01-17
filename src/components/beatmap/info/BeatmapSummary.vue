<template>
  <v-container>
    <div class="background-placement">
      <span class="align-helper"/>
      <BeatmapCover
        :beatmap="beatmap"
        class="background-blurred-cover"
        :gradient="`to top, rgba(${gradientColor}, 1) 25%, rgba(0, 0, 0, 0) 100%`"
      />
    </div>
    {{ beatmap.key }}
  </v-container>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import { BeatsaverBeatmap } from '@/libraries/net/beatsaver/BeatsaverBeatmap';
import BeatmapCover from '@/components/beatmap/cover/BeatmapCover.vue';

export default Vue.extend({
  name: 'BeatmapSummary',
  components: { BeatmapCover },
  props: {
    beatmap: { type: Object as PropType<BeatsaverBeatmap>, required: true },
  },
  computed: {
    gradientColor(): string {
      return this.$vuetify.theme.dark ? '48, 48, 48' : '255, 255, 255';
    },
  },
});
</script>

<style scoped>
  .background-placement {
    position: absolute;
    left: 0;
    top: -30px;
    width: 100%;
    z-index: -1;
    text-align: center;
  }

  .align-helper {
    display: inline-block;
    height: 100%;
    vertical-align: middle;
  }

  .background-blurred-cover {
    object-fit: none;
    object-position: center;
    vertical-align: middle;
    -webkit-filter: blur(4px);
    width: 100%;
    height: 400px;
  }
</style>
