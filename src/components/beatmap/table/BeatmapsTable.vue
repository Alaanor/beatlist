<template>
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
      v-for="header in getHeaders()"
      v-slot:[headerToSlotName(header)]="{ item }"
    >
      <component
        :is="`BeatmapsTableTemplate${header.template}`"
        :key="header.value"
        :item="item.raw"
        :header="header"
      />
    </template>

    <template
      v-if="!noFilter"
      #body.append
    >
      <BeatmapsTableFilterRow
        :headers="getHeaders()"
        :filters-value="filtersValue"
      />
    </template>
  </v-data-table>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import { sync } from 'vuex-pathify';
import { BeatmapsTableDataUnit } from '@/components/beatmap/table/core/BeatmapsTableDataUnit';
import { DifficultiesSimple } from '@/libraries/net/beatsaver/BeatsaverBeatmap';
import {
  BeatmapsTableFilterType,
  BeatmapsTableHeader,
  BeatmapsTableHeadersTemplate,
} from '@/components/beatmap/table/core/BeatmapsTableHeaders';
import {
  sortDateFromString, sortNumber, sortText,
} from '@/components/beatmap/table/core/function/BeatmapsTableSortFunctions';
import {
  Range, DateRange, IsIn, IsInDate,
} from '@/libraries/common/Range';

// Template
import BeatmapsTableTemplateCover from '@/components/beatmap/table/core/template/BeatmapsTableTemplateCover.vue';
import BeatmapsTableTemplateText from '@/components/beatmap/table/core/template/BeatmapsTableTemplateText.vue';
import BeatmapsTableTemplateTextTooltip from '@/components/beatmap/table/core/template/BeatmapsTableTemplateTextTooltip.vue';
import BeatmapsTableTemplateBeatmapName from '@/components/beatmap/table/core/template/BeatmapsTableTemplateBeatmapName.vue';
import BeatmapsTableTemplateStrToDate from '@/components/beatmap/table/core/template/BeatmapsTableTemplateStrToDate.vue';
import BeatmapsTableTemplateDifficulties from '@/components/beatmap/table/core/template/BeatmapsTableTemplateDifficulties.vue';
import BeatmapsTableTemplateRating from '@/components/beatmap/table/core/template/BeatmapsTableTemplateRating.vue';
import BeatmapsTableColumnSelector from '@/components/beatmap/table/core/BeatmapsTableColumnSelector.vue';
import BeatmapsTableFooter from '@/components/beatmap/table/core/BeatmapsTableFooter.vue';
import BeatmapsTableFilterRow from '@/components/beatmap/table/core/BeatmapsTableFilterRow.vue';

export default Vue.extend({
  name: 'BeatmapsTable',
  components: {
    BeatmapsTableColumnSelector,
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
    items: { type: Array as PropType<BeatmapsTableDataUnit[]>, required: true },
    shownColumn: { type: Array as PropType<string[]>, required: true },
    noFilter: { type: Boolean, default: false },
  },
  data: () => ({
    options: {
      page: 1,
    },
    filtersValue: {
      name: '',
      artist: '',
      mapper: '',
      dl: {} as Range,
      plays: {} as Range,
      upvotes: {} as Range,
      downvotes: {} as Range,
      rating: {} as Range,
      difficulties: ['easy', 'normal', 'hard', 'expert', 'expertPlus'],
      uploaded: {} as DateRange,
      key: '',
      hash: '',
    },
  }),
  computed: {
    itemsPerPage: sync<number>('settings/beatmapsTable@itemsPerPage'),
    headers(): BeatmapsTableHeader[] {
      return [
        {
          value: 'cover',
          text: 'Cover',
          template: BeatmapsTableHeadersTemplate.Cover,
          align: 'left',
          sortable: false,
          filterable: false,
          width: 48,
        },
        {
          value: 'name',
          text: 'Song name',
          template: BeatmapsTableHeadersTemplate.BeatmapName,
          align: 'left',
          sortable: true,
          filterable: true,
          filter: (value: string) => value
            .toLowerCase()
            .includes(this.filtersValue.name.toLowerCase()),
          filterType: BeatmapsTableFilterType.Text,
          sort: sortText,
        },
        {
          value: 'artist',
          text: 'Artist',
          template: BeatmapsTableHeadersTemplate.Text,
          templateItemAccess: 'metadata.songAuthorName',
          align: 'left',
          sortable: true,
          filterable: true,
          filter: (value: string) => value
            .toLowerCase()
            .includes(this.filtersValue.artist.toLowerCase()),
          filterType: BeatmapsTableFilterType.Text,
          sort: sortText,
        },
        {
          value: 'mapper',
          text: 'Mapper',
          template: BeatmapsTableHeadersTemplate.Text,
          templateItemAccess: 'metadata.levelAuthorName',
          align: 'left',
          sortable: true,
          filterable: true,
          filter: (value: string) => value
            .toLowerCase()
            .includes(this.filtersValue.mapper.toLowerCase()),
          filterType: BeatmapsTableFilterType.Text,
          sort: sortText,
        },
        {
          value: 'difficulties',
          text: 'Difficulties',
          template: BeatmapsTableHeadersTemplate.Difficulties,
          templateItemAccess: 'metadata.difficulties',
          align: 'left',
          sortable: false,
          filterType: BeatmapsTableFilterType.Difficulties,
          filterable: true,
          filter: (value: DifficultiesSimple) => this.filtersValue.difficulties
            .some((diff: string) => value[diff]),
        },
        {
          value: 'dl',
          text: 'Downloads',
          template: BeatmapsTableHeadersTemplate.Text,
          templateItemAccess: 'stats.downloads',
          align: 'center',
          sortable: true,
          filterable: true,
          filterType: BeatmapsTableFilterType.RangeInt,
          filter: (value: number) => IsIn(value, this.filtersValue.dl),
          sort: sortNumber,
        },
        {
          value: 'plays',
          text: 'Plays',
          template: BeatmapsTableHeadersTemplate.Text,
          templateItemAccess: 'stats.plays',
          align: 'center',
          sortable: true,
          filterable: true,
          filterType: BeatmapsTableFilterType.RangeInt,
          filter: (value: number) => IsIn(value, this.filtersValue.plays),
          sort: sortNumber,
        },
        {
          value: 'upvotes',
          text: 'Up votes',
          template: BeatmapsTableHeadersTemplate.Text,
          templateItemAccess: 'stats.upVotes',
          align: 'center',
          sortable: true,
          filterable: true,
          filterType: BeatmapsTableFilterType.RangeInt,
          filter: (value: number) => IsIn(value, this.filtersValue.upvotes),
          sort: sortNumber,
        },
        {
          value: 'downvotes',
          text: 'Down votes',
          template: BeatmapsTableHeadersTemplate.Text,
          templateItemAccess: 'stats.downVotes',
          align: 'center',
          sortable: true,
          filterable: true,
          filterType: BeatmapsTableFilterType.RangeInt,
          filter: (value: number) => IsIn(value, this.filtersValue.downvotes),
          sort: sortNumber,
        },
        {
          value: 'rating',
          text: 'Rating',
          template: BeatmapsTableHeadersTemplate.Rating,
          templateItemAccess: 'stats.rating',
          align: 'center',
          sortable: true,
          filterable: true,
          filterType: BeatmapsTableFilterType.RangeInt,
          filter: (value: number) => IsIn(value, this.filtersValue.rating),
          sort: sortNumber,
        },
        {
          value: 'uploaded',
          text: 'Uploaded',
          template: BeatmapsTableHeadersTemplate.StrToDate,
          templateItemAccess: 'uploaded',
          align: 'center',
          sortable: true,
          filterable: true,
          filterType: BeatmapsTableFilterType.Date,
          filter: (value: string) => IsInDate(new Date(value), this.filtersValue.uploaded),
          sort: sortDateFromString,
        },
        {
          value: 'key',
          text: 'Key',
          template: BeatmapsTableHeadersTemplate.Text,
          templateItemAccess: 'key',
          align: 'center',
          sortable: false,
          filterable: true,
          filterType: BeatmapsTableFilterType.Text,
          filter: (value: string) => value
            .toLowerCase()
            .includes(this.filtersValue.key.toLowerCase()),
          sort: sortNumber,
        },
        {
          value: 'hash',
          text: 'Hash',
          template: BeatmapsTableHeadersTemplate.Text,
          templateItemAccess: 'hash',
          align: 'center',
          sortable: false,
          filterable: true,
          filterType: BeatmapsTableFilterType.Text,
          filter: (value: string) => value
            .toLowerCase()
            .includes(this.filtersValue.hash.toLowerCase()),
          sort: sortNumber,
        },
      ] as BeatmapsTableHeader[];
    },
    beatmapAsTableData(): any[] {
      return this.items.map((entry: BeatmapsTableDataUnit) => ({
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
    headerToSlotName(header: any): string {
      return `item.${header.value}`;
    },
    getHeaders() {
      return this.headers.filter((header) => this.shownColumn.includes(header.value));
    },
  },
});
</script>

<style scoped>

</style>
