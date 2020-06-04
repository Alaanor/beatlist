<template>
  <v-row align="center">
    <v-col cols="auto">
      <table
        aria-describedby="infos about the difficulty (1st column)"
        class="align-first-column-left"
      >
        <tr>
          <td class="body-2 pr-2">
            Duration
          </td>
          <td class="body-1 pl-2">
            <Tooltip :text="difficulty.duration.toString()" right>
              {{ difficulty.duration.toFixed(2) }}
            </Tooltip>
          </td>
        </tr>
        <tr>
          <td class="body-2 pr-2">
            length
          </td>
          <td class="body-1 pl-2">
            {{ difficulty.length }}
          </td>
        </tr>
        <tr>
          <td class="body-2 pr-2">
            Bombs
          </td>
          <td class="body-1 pl-2">
            {{ difficulty.bombs }}
          </td>
        </tr>
        <tr>
          <td class="body-2 pr-2">
            Notes
          </td>
          <td class="body-1 pl-2">
            {{ difficulty.notes }}
          </td>
        </tr>
      </table>
    </v-col>
    <v-col cols="auto">
      <table
        aria-describedby="infos about the difficulty (2nd column)"
        class="align-first-column-left"
      >
        <tr>
          <td class="body-2 pr-2">
            Obstacles
          </td>
          <td class="body-1 pl-2">
            {{ difficulty.obstacles }}
          </td>
        </tr>
        <tr>
          <td class="body-2 pr-2">
            njs
          </td>
          <td class="body-1 pl-2">
            {{ difficulty.njs }}
          </td>
        </tr>
        <tr>
          <td class="body-2 pr-2">
            njs offset
          </td>
          <td class="body-1 pl-2">
            {{ difficulty.njsOffset }}
          </td>
        </tr>
      </table>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import Vue, { PropType } from "vue";
import { Difficulty } from "@/libraries/net/beatsaver/BeatsaverBeatmap";
import Tooltip from "@/components/helper/Tooltip.vue";

export default Vue.extend({
  name: "BeatmapSummaryDifficulty",
  components: { Tooltip },
  props: {
    difficulty: { type: Object as PropType<Difficulty>, required: true },
  },
});
</script>
