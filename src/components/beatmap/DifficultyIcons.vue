<template>
  <v-container :class="short ? 'pa-0 pl-3' : 'pa-1 ml-n2'">
    <v-tooltip v-for="difficulty in difficulties" :key="difficulty.string" top>
      <template #activator="{ on }">
        <v-chip
          :color="grayScaled ? difficulty.colorGrayscaled : difficulty.color"
          :small="small"
          :class="short ? 'ml-n3' : 'ma-1'"
          v-on="on"
        >
          <span style="margin-left: -1px; margin-right: -1px;">
            {{ difficulty.char }}
          </span>
        </v-chip>
      </template>
      <span>{{ difficulty.string }}</span>
    </v-tooltip>
  </v-container>
</template>

<script lang="ts">
import Vue, { PropType } from "vue";
import DifficultyData from "@/libraries/app/difficulties/DifficultyData";
import getDifficulty from "@/libraries/app/difficulties/Difficulty";
import { get } from "vuex-pathify";
import { ColorblindMode } from "@/libraries/app/DifficultyLabels";

export default Vue.extend({
  name: "DifficultyIcons",
  props: {
    diff: { type: Object as PropType<DifficultiesSimple>, required: true },
    small: { type: Boolean, default: false },
    short: { type: Boolean, default: false },
  },
  data: () => ({
    difficulties: [] as DifficultyData,
    grayScaled: Boolean,
  }),
  computed: {
    colorBlindMode: get<ColorblindMode>(
      "settings/accessibility@colorBlindMode"
    ),
  },
  watch: {
    diff: {
      handler(): void {
        this.computeDifficulties();
      },
      immediate: true,
    },
    colorBlindMode(): void {
      this.computeDifficulties();
    },
  },
  methods: {
    computeDifficulties(): void {
      this.difficulties = Object.entries(this.diff)
        .filter(([key]) => key !== undefined && this.diff[key]) // I'm really annoyed that the linter won't allow (v: [key, value]) => value because key isn't used >:|
        .map(([key]) => getDifficulty(key))
        .sort((a: DifficultyData, b: DifficultyData) => a.order - b.order);

      this.grayScaled = this.colorBlindMode === ColorblindMode.Greyscale;
    },
  },
});
</script>
