<template>
  <v-row align="center">
    <v-col cols="auto">
      <table>
        <tr>
          <td
            class="body-2 pr-2"
            align="right"
          >
            Duration
          </td>
          <td class="body-1 pl-2">
            <Tooltip
              :text="difficulty.duration.toString()"
              right
            >
              {{ difficulty.duration.toFixed(2) }}
            </Tooltip>
          </td>
        </tr>
        <tr>
          <td
            class="body-2 pr-2"
            align="right"
          >
            length
          </td>
          <td class="body-1 pl-2">
            {{ difficulty.length }}
          </td>
        </tr>
        <tr>
          <td
            class="body-2 pr-2"
            align="right"
          >
            Bombs
          </td>
          <td class="body-1 pl-2">
            {{ difficulty.bombs }}
          </td>
        </tr>
        <tr>
          <td
            class="body-2 pr-2"
            align="right"
          >
            Notes
          </td>
          <td class="body-1 pl-2">
            {{ difficulty.notes }}
          </td>
        </tr>
      </table>
    </v-col>
    <v-col cols="auto">
      <table>
        <tr>
          <td
            class="body-2 pr-2"
            align="right"
          >
            Obstacles
          </td>
          <td class="body-1 pl-2">
            {{ difficulty.obstacles }}
          </td>
        </tr>
        <tr>
          <td
            class="body-2 pr-2"
            align="right"
          >
            njs
          </td>
          <td class="body-1 pl-2">
            {{ difficulty.njs }}
          </td>
        </tr>
        <tr>
          <td
            class="body-2 pr-2"
            align="right"
          >
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
import Vue, { PropType } from 'vue';
import { Difficulty } from '@/libraries/net/beatsaver/BeatsaverBeatmap';
import Tooltip from '@/components/helper/Tooltip.vue';

export default Vue.extend({
  name: 'BeatmapSummaryDifficulty',
  components: { Tooltip },
  props: {
    difficulty: { type: Object as PropType<Difficulty>, required: true },
  },
});
</script>

<style scoped>

</style>
