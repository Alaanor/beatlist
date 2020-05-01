<template>
  <v-container>
    <div class="background-placement">
      <span class="align-helper" />
      <BeatmapCover
        :beatmap="beatmap"
        class="background-blurred-cover"
        :gradient="`to top, rgba(${gradientColor}, 1) 25%, rgba(0, 0, 0, 0.25) 100%`"
      />
    </div>
    <v-row>
      <v-col cols="auto">
        <BeatmapCoverAvatar :beatmap="beatmap" :avatar-size="192" tile />
      </v-col>
      <v-col align-self="center">
        <p class="d-flex align-baseline mb-0">
          <span class="display-1 mb-0">
            {{ beatmap.metadata.songName }}
          </span>
          <span class="headline grey--text mb-0 ml-3">
            {{ beatmap.metadata.songSubName }}
          </span>
        </p>
        <p class="headline grey--text mb-0">
          {{ beatmap.metadata.levelAuthorName }}
        </p>
        <DifficultiesChips :diff="beatmap.metadata.difficulties" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue, { PropType } from "vue";
import { BeatsaverBeatmap } from "@/libraries/net/beatsaver/BeatsaverBeatmap";
import BeatmapCover from "@/components/beatmap/cover/BeatmapCover.vue";
import BeatmapCoverAvatar from "@/components/beatmap/cover/BeatmapCoverAvatar.vue";
import DifficultiesChips from "@/components/beatmap/DifficultiesChips.vue";

export default Vue.extend({
  name: "BeatmapSummary",
  components: { BeatmapCover, BeatmapCoverAvatar, DifficultiesChips },
  props: {
    beatmap: { type: Object as PropType<BeatsaverBeatmap>, required: true },
  },
  computed: {
    gradientColor(): string {
      return this.$vuetify.theme.dark ? "18, 18, 18" : "255, 255, 255";
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
