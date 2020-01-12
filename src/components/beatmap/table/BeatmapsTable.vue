<template>
  <v-container>
    <v-chip-group
      v-model="shownColumn"
      mandatory
      multiple
      show-arrows
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

    <v-card>
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
          <BeatmapsTableFooter
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
            :is="`BeatmapsTableTemplate${header.template}`"
            :key="header.value"
            :item="item.raw"
            :header="header"
          />
        </template>

        <template #body.append>
          <BeatmapsTableFilterRow
            :headers="getHeaders()"
            @forceUpdate="forceUpdate"
          />
        </template>
      </v-data-table>
    </v-card>
  </v-container>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import { sync } from 'vuex-pathify';
import { BeatmapsTableDataUnit } from '@/components/beatmap/table/BeatmapsTableDataUnit';
import { headers, headersFilterValue, customSort } from '@/components/beatmap/table/BeatmapsTable';
import BeatmapsTableFooter from '@/components/beatmap/table/BeatmapsTableFooter.vue';
import BeatmapsTableFilterRow from '@/components/beatmap/table/BeatmapsTableFilterRow.vue';

// Template
import BeatmapsTableTemplateCover from '@/components/beatmap/table/template/BeatmapsTableTemplateCover.vue';
import BeatmapsTableTemplateText from '@/components/beatmap/table/template/BeatmapsTableTemplateText.vue';
import BeatmapsTableTemplateTextTooltip from '@/components/beatmap/table/template/BeatmapsTableTemplateTextTooltip.vue';
import BeatmapsTableTemplateBeatmapName from '@/components/beatmap/table/template/BeatmapsTableTemplateBeatmapName.vue';
import BeatmapsTableTemplateStrToDate from '@/components/beatmap/table/template/BeatmapsTableTemplateStrToDate.vue';
import BeatmapsTableTemplateDifficulties from '@/components/beatmap/table/template/BeatmapsTableTemplateDifficulties.vue';
import BeatmapsTableTemplateRating from '@/components/beatmap/table/template/BeatmapsTableTemplateRating.vue';

export default Vue.extend({
  name: 'BeatmapLocal',
  components: {
    BeatmapsTableFooter,
    BeatmapsTableFilterRow,
    BeatmapsTableTemplateCover,
    BeatmapsTableTemplateText,
    BeatmapsTableTemplateDifficulties,
    BeatmapsTableTemplateTextTooltip,
    BeatmapsTableTemplateBeatmapName,
    BeatmapsTableTemplateStrToDate,
    BeatmapsTableTemplateRating,
  },
  props: {
    beatmaps: { type: Array as PropType<BeatmapsTableDataUnit[]>, required: true },
  },
  data: () => ({
    search: '',
    test: '',
    options: {
      page: 1,
    },
  }),
  computed: {
    headers: () => headers,
    headersFilterValue: () => headersFilterValue,
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
        name: `${entry.data.metadata.songName} - ${entry.data.metadata.songSubName}`,
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
    forceUpdate() {
      // dumb workaround to trigger an update event on the table
      this.options.page += 1;
      this.options.page -= 1;
    },
  },
});
</script>
