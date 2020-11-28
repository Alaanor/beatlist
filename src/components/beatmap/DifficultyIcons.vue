<template>
  <v-container :class="short ? 'pa-0 pl-3' : 'pa-1 ml-n2'">
    <v-tooltip v-for="difficulty in difficulties" :key="difficulty.string" top>
      <template #activator="{ on }">
        <v-chip
          :color="getColor(difficulty)"
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
import DifficultyInformation from "@/libraries/app/difficulties/DifficultyInformation";
import {
  getDifficulty,
  getColor,
} from "@/libraries/app/difficulties/Difficulty";
import { DifficultiesSimple } from "@/libraries/net/beatsaver/BeatsaverBeatmap";
import { get } from "vuex-pathify";
import { ColorMode } from "@/libraries/app/ColorMode";

export default Vue.extend({
  name: "DifficultyIcons",
  props: {
    diff: { type: Object as PropType<DifficultiesSimple>, required: true },
    small: { type: Boolean, default: false },
    short: { type: Boolean, default: false },
  },
  data: () => ({
    difficulties: [] as DifficultyInformation[],
  }),
  computed: {
    colorMode: get<ColorMode>("settings/accessibility@colorMode"),
  },
  watch: {
    diff: {
      handler(): void {
        this.computeDifficulties();
      },
      immediate: true,
    },
  },
  methods: {
    computeDifficulties(): void {
      this.difficulties = Object.entries(this.diff)
        .filter(
          (difficulty: [string | undefined, boolean]): boolean =>
            difficulty[0] !== undefined && difficulty[1]
        )
        .map((key: [string, boolean]): DifficultyInformation | undefined =>
          getDifficulty(key[0])
        )
        .filter(
          (difficulty: DifficultyInformation | undefined): boolean =>
            difficulty !== undefined
        ) as DifficultyInformation[];
      // Can't chain this because of stupid type-checking reasons
      this.difficulties.sort(
        (a: DifficultyInformation, b: DifficultyInformation) =>
          a.order - b.order
      );
    },
    getColor(difficulty: DifficultyInformation): string {
      return getColor(difficulty, this.colorMode);
    },
  },
});
</script>
