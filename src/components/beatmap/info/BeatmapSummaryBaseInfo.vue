<template>
  <v-container class="pa-0">
    <v-row align="center">
      <v-col cols="6">
        <table aria-describedby="infos about the beatmap (1st column)">
          <tr>
            <td class="body-2 pr-2" align="right">
              Name
            </td>
            <td class="body-1 pl-2">
              {{ beatmap.metadata.songName | emptyCheck }}
            </td>
          </tr>
          <tr>
            <td class="body-2 pr-2" align="right">
              Subname
            </td>
            <td class="body-1 pl-2">
              {{ beatmap.metadata.songSubName | emptyCheck }}
            </td>
          </tr>
          <tr>
            <td class="body-2 pr-2" align="right">
              Author
            </td>
            <td class="body-1 pl-2">
              {{ beatmap.metadata.songAuthorName | emptyCheck }}
            </td>
          </tr>
          <tr>
            <td class="body-2 pr-2" align="right">
              Mapper
            </td>
            <td class="body-1 pl-2">
              {{ beatmap.metadata.levelAuthorName | emptyCheck }}
            </td>
          </tr>
          <tr>
            <td class="body-2 pr-2" align="right">
              BPM
            </td>
            <td class="body-1 pl-2">
              {{ beatmap.metadata.bpm }}
            </td>
          </tr>
          <tr>
            <td class="body-2 pr-2" align="right">
              Key
            </td>
            <td class="body-1 pl-2">
              {{ beatmap.key }}
            </td>
          </tr>
          <tr>
            <td class="body-2 pr-2" align="right">
              Difficulties
            </td>
            <td class="pl-2">
              <DifficultiesChips
                :diff="beatmap.metadata.difficulties"
                short
                small
              />
            </td>
          </tr>
        </table>
      </v-col>
      <v-col cols="6">
        <table aria-describedby="infos about the beatmap (second column)">
          <tr>
            <td class="body-2 pr-2" align="right">
              Uploaded
            </td>
            <td class="body-1 pl-2">
              {{ beatmap.uploaded | toDate }}
            </td>
          </tr>
          <tr>
            <td class="body-2 pr-2" align="right">
              Downloads
            </td>
            <td class="body-1 pl-2">
              {{ beatmap.stats.downloads }}
            </td>
          </tr>
          <tr>
            <td class="body-2 pr-2" align="right">
              Plays
            </td>
            <td class="body-1 pl-2">
              {{ beatmap.stats.plays }}
            </td>
          </tr>
          <tr>
            <td class="body-2 pr-2" align="right">
              Up votes
            </td>
            <td class="body-1 pl-2">
              {{ beatmap.stats.upVotes }}
            </td>
          </tr>
          <tr>
            <td class="body-2 pr-2" align="right">
              Down votes
            </td>
            <td class="body-1 pl-2">
              {{ beatmap.stats.downVotes }}
            </td>
          </tr>
          <tr>
            <td class="body-2 pr-2" align="right">
              Rating
            </td>
            <td class="body-1 pl-2">
              <Tooltip :text="beatmap.stats.rating.toString()" right>
                {{ beatmap.stats.rating | toPercent }}
              </Tooltip>
            </td>
          </tr>
        </table>
      </v-col>
      <v-col cols="12">
        <v-expansion-panels
          v-if="beatmap.description"
          v-model="descriptionPanel"
          flat
          popout
        >
          <v-expansion-panel>
            <v-expansion-panel-header>Description</v-expansion-panel-header>
            <v-expansion-panel-content>
              <span v-html="Linkify(FormatNewLine(beatmap.description))" />
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
        <p v-else class="grey--text font-italic">
          No description given.
        </p>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue, { PropType } from "vue";
import linkifyHtml from "linkifyjs/html";
import { BeatsaverBeatmap } from "@/libraries/net/beatsaver/BeatsaverBeatmap";
import DifficultiesChips from "@/components/beatmap/DifficultiesChips.vue";
import Tooltip from "@/components/helper/Tooltip.vue";

export default Vue.extend({
  name: "BeatmapSummaryBaseInfo",
  components: { DifficultiesChips, Tooltip },
  filters: {
    toDate(value: string): string {
      return new Date(value).toLocaleString();
    },
    toPercent(value: number): string {
      return `${(value * 100).toFixed(2)}%`;
    },
    emptyCheck(value: string): string {
      return value || "-";
    },
  },
  props: {
    beatmap: { type: Object as PropType<BeatsaverBeatmap>, required: true },
  },
  data: () => ({
    descriptionPanel: 0,
  }),
  methods: {
    Linkify(str: string): string {
      return linkifyHtml(str);
    },
    FormatNewLine(str: string): string {
      return str.replace(/\r\n/g, "<br>").replace(/\n/g, "<br>");
    },
  },
});
</script>

<style>
a.linkified {
  color: cornflowerblue !important;
}
</style>
