<template>
  <v-container>
    <v-chip-group
      v-model="shownColumn"
      mandatory
      multiple
    >
      <v-chip
        v-for="column in availableColumn"
        :key="column.value"
        :value="column.value"
        class="success--text"
        outlined
        small
      >
        {{ column.name }}
      </v-chip>
    </v-chip-group>
    <v-data-table
      :headers="getHeaders()"
      :items="beatmapAsTableData"
      :options="{...options, itemsPerPage}"
      item-key="hash"
      hide-default-footer
      fixed-header
      dense
    >
      <template #footer="{ props: { pagination } }">
        <BeatmapTableFooter
          :items-per-page="itemsPerPage"
          :options="options"
          :pagination="pagination"
        />
      </template>

      <template
        v-for="header in headers"
        v-slot:[headerToSlotName(header)]="{ item }"
      >
        <component
          :is="`BeatmapTableTemplate${header.template}`"
          :key="header.value"
          :item="item.raw"
          :header="header"
        />
      </template>
    </v-data-table>
  </v-container>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import { sync } from 'vuex-pathify';
import { BeatmapsTableDataUnit } from '@/components/beatmap/table/BeatmapsTableDataUnit';
import BeatmapTableFooter from '@/components/beatmap/table/BeatmapsTableFooter.vue';
import { headers, customSort } from '@/components/beatmap/table/BeatmapsTable';

// Template
import BeatmapTableTemplateCover from '@/components/beatmap/table/template/BeatmapTableTemplateCover.vue';
import BeatmapTableTemplateText from '@/components/beatmap/table/template/BeatmapTableTemplateText.vue';
import BeatmapTableTemplateTextTooltip from '@/components/beatmap/table/template/BeatmapTableTemplateTextTooltip.vue';
import BeatmapTableTemplateBeatmapName from '@/components/beatmap/table/template/BeatmapTableTemplateBeatmapName.vue';
import BeatmapTableTemplateStrToDate from '@/components/beatmap/table/template/BeatmapTableTemplateStrToDate.vue';
import BeatmapTableTemplateDifficulties from '@/components/beatmap/table/template/BeatmapTableTemplateDifficulties.vue';
import BeatmapTableTemplateRating from '@/components/beatmap/table/template/BeatmapTableTemplateRating.vue';

export default Vue.extend({
  name: 'BeatmapLocal',
  components: {
    BeatmapTableFooter,
    BeatmapTableTemplateCover,
    BeatmapTableTemplateText,
    BeatmapTableTemplateDifficulties,
    BeatmapTableTemplateTextTooltip,
    BeatmapTableTemplateBeatmapName,
    BeatmapTableTemplateStrToDate,
    BeatmapTableTemplateRating,
  },
  props: {
    beatmaps: { type: Array as PropType<BeatmapsTableDataUnit[]>, required: true },
  },
  data: () => ({
    options: {
      page: 1,
    },
  }),
  computed: {
    headers: () => headers,
    customSort: () => customSort,
    shownColumn: sync<string[]>('settings/beatmapsTable@shownColumn'),
    itemsPerPage: sync<number>('settings/beatmapsTable@itemsPerPage'),
    availableColumn() {
      return headers.map((header) => ({
        name: header.text,
        value: header.value,
      }));
    },
    beatmapAsTableData() {
      return this.beatmaps.map((entry: BeatmapsTableDataUnit) => ({
        raw: entry,
        name: entry.data.metadata.songName,
        artist: entry.data.metadata.songAuthorName,
        mapper: entry.data.metadata.levelAuthorName,
        difficulties: entry.data.metadata.difficulties,
        dl: entry.data.stats.downloads,
        plays: entry.data.stats.plays,
        upvotes: entry.data.stats.upVotes,
        downvotes: entry.data.stats.downVotes,
        rating: entry.data.stats.rating,
        uploaded: entry.data.uploaded,
        key: entry.data.key,
        hash: entry.data.hash,
      }));
    },
  },
  methods: {
    getHeaders() {
      return headers.filter((header) => this.shownColumn.includes(header.value));
    },
    headerToSlotName(header: any): string {
      return `item.${header.value}`;
    },
  },
});
</script>
