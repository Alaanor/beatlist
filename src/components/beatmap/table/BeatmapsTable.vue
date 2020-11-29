<template>
  <v-data-table
    v-model="selectedItem"
    :headers="getHeaders()"
    :items="beatmapAsTableDataFiltered"
    :options="{ page: currentPage, itemsPerPage }"
    :server-items-length="serverItemsLength"
    :loading="loading"
    :disable-sort="noSort"
    :fixed-header="fixedHeader"
    :show-select="selected !== undefined"
    loading-text="Loading contents ..."
    item-key="hash"
    aria-describedby="List of beatmaps for the current context"
    hide-default-footer
    dense
  >
    <template #footer="{ props: { pagination } }">
      <TableFooter
        :items-per-page="itemsPerPage"
        :items-per-page-list="itemsPerPageList"
        :no-item-per-page-choice="noItemPerPageChoice"
        :page.sync="currentPage"
        :pagination="pagination"
        v-on="$listeners"
      />
    </template>

    <template
      v-for="header in getHeaders()"
      v-slot:[headerToSlotName(header)]="{ item }"
    >
      <component
        :is="`BeatmapsTableTemplate${header.template}`"
        v-if="header.value !== 'actions'"
        :key="header.value"
        :item="item.raw"
        :header="header"
      />

      <span
        v-else-if="!noActions"
        :key="header.value"
        class="d-flex justify-center"
      >
        <slot name="actions" :beatsaver="item.raw.data" />
        <Tooltip text="See more">
          <v-btn
            :to="{
              name: seeMoreRouteName,
              params: { hash: item.raw.data.hash },
            }"
            icon
            small
            exact
          >
            <v-icon small>chevron_right</v-icon>
          </v-btn>
        </Tooltip>
      </span>
    </template>

    <template #progress>
      <v-progress-linear color="success" indeterminate />
    </template>

    <template #header.data-table-select>
      <v-simple-checkbox
        :value="selected.length > 0"
        :indeterminate="
          selected.length !== items.length && selected.length !== 0
        "
        @input="selectAllItems"
      />
    </template>

    <template #item.data-table-select="{ item }">
      <v-simple-checkbox
        :value="selected.includes(item.raw.data)"
        @input="((value) => selectThisItem(item.raw.data, value))"
      />
    </template>
  </v-data-table>
</template>

<script lang="ts">
import Vue, { PropType } from "vue";
import { BeatmapsTableDataUnit } from "@/components/beatmap/table/core/BeatmapsTableDataUnit";
import { BeatsaverBeatmap } from "@/libraries/net/beatsaver/BeatsaverBeatmap";
import Tooltip from "@/components/helper/Tooltip.vue";
import {
  BeatmapsTableFilterType,
  BeatmapsTableHeader,
  BeatmapsTableHeadersTemplate,
} from "@/components/beatmap/table/core/BeatmapsTableHeaders";
import {
  sortDateFromString,
  sortNumber,
  sortText,
} from "@/components/beatmap/table/core/function/BeatmapsTableSortFunctions";
import {
  FilterDateRange,
  FilterRange,
  FilterText,
  FilterDifficulties,
  filter,
} from "@/components/beatmap/table/core/filter/BeatmapsTableFilterFunction";
import { DateRange, Range } from "@/libraries/common/Range";

// Template
import BeatmapsTableTemplateCover from "@/components/beatmap/table/core/template/BeatmapsTableTemplateCover.vue";
import BeatmapsTableTemplateText from "@/components/beatmap/table/core/template/BeatmapsTableTemplateText.vue";
import BeatmapsTableTemplateTextTooltip from "@/components/beatmap/table/core/template/BeatmapsTableTemplateTextTooltip.vue";
import BeatmapsTableTemplateBeatmapName from "@/components/beatmap/table/core/template/BeatmapsTableTemplateBeatmapName.vue";
import BeatmapsTableTemplateStrToDate from "@/components/beatmap/table/core/template/BeatmapsTableTemplateStrToDate.vue";
import BeatmapsTableTemplateDifficulties from "@/components/beatmap/table/core/template/BeatmapsTableTemplateDifficulties.vue";
import BeatmapsTableTemplatePlaylists from "@/components/beatmap/table/core/template/BeatmapsTableTemplatePlaylists.vue";
import BeatmapsTableTemplateRating from "@/components/beatmap/table/core/template/BeatmapsTableTemplateRating.vue";
import ColumnSelector from "@/components/beatmap/table/core/ColumnSelector.vue";
import TableFooter from "@/components/beatmap/table/core/TableFooter.vue";

export default Vue.extend({
  name: "BeatmapsTable",
  components: {
    ColumnSelector,
    TableFooter,
    BeatmapsTableTemplateCover,
    BeatmapsTableTemplateText,
    BeatmapsTableTemplateDifficulties,
    BeatmapsTableTemplatePlaylists,
    BeatmapsTableTemplateTextTooltip,
    BeatmapsTableTemplateBeatmapName,
    BeatmapsTableTemplateStrToDate,
    BeatmapsTableTemplateRating,
    Tooltip,
  },
  props: {
    items: { type: Array as PropType<BeatmapsTableDataUnit[]>, required: true },
    shownColumn: { type: Array as PropType<string[]>, required: true },
    noFilter: { type: Boolean, default: false },
    itemsPerPage: { type: Number, default: undefined },
    itemsPerPageList: { type: Array as PropType<number[]>, default: undefined },
    noItemPerPageChoice: { type: Boolean, default: false },
    serverItemsLength: { type: Number, default: undefined },
    loading: { type: Boolean, default: false },
    fixedHeader: { type: Boolean, default: false },
    height: { type: Number, default: undefined },
    seeMoreRouteName: { type: String, default: undefined },
    noActions: { type: Boolean, default: false },
    noSort: { type: Boolean, default: false },
    page: { type: Number, default: 1 },
    selected: {
      type: Array as PropType<BeatsaverBeatmap[]>,
      default: undefined,
    },
    search: { type: String, default: undefined },
  },
  data: () => ({
    filtersValue: {
      name: "",
      artist: "",
      mapper: "",
      dl: {} as Range,
      plays: {} as Range,
      upvotes: {} as Range,
      downvotes: {} as Range,
      rating: {} as Range,
      difficulties: ["easy", "normal", "hard", "expert", "expertPlus"],
      uploaded: {} as DateRange,
      key: "",
      hash: "",
    },
    itemsDisplayed: [] as { raw: BeatmapsTableDataUnit }[],
    selectedItem: [] as { hash: string; key: string }[],
    currentPage: 1,
  }),
  computed: {
    headers(): BeatmapsTableHeader[] {
      return [
        {
          value: "cover",
          text: "Cover",
          template: BeatmapsTableHeadersTemplate.Cover,
          align: "left",
          sortable: false,
          width: 50,
        },
        {
          value: "name",
          text: "Song name",
          template: BeatmapsTableHeadersTemplate.BeatmapName,
          align: "left",
          sortable: true,
          filterable: true,
          searchPrefix: ["name", "song"],
          requiresPrefix: false,
          globalSearch: (value: any, query: string) =>
            FilterText(value.name, query),
          filterType: BeatmapsTableFilterType.Text,
          sort: sortText,
          width: 225,
        },
        {
          value: "artist",
          text: "Artist",
          template: BeatmapsTableHeadersTemplate.TextTooltip,
          templateItemAccess: "metadata.songAuthorName",
          align: "left",
          sortable: true,
          searchPrefix: ["artist", "author", "auth"],
          requiresPrefix: false,
          globalSearch: (value: any, query: string) =>
            FilterText(value.artist, query),
          sort: sortText,
          width: 125,
        },
        {
          value: "mapper",
          text: "Mapper",
          template: BeatmapsTableHeadersTemplate.TextTooltip,
          templateItemAccess: "metadata.levelAuthorName",
          align: "left",
          sortable: true,
          searchPrefix: ["mapper"],
          requiresPrefix: false,
          globalSearch: (value: any, query: string) =>
            FilterText(value.mapper, query),
          sort: sortText,
          width: 125,
        },
        {
          value: "difficulties",
          text: "Difficulties",
          template: BeatmapsTableHeadersTemplate.Difficulties,
          templateItemAccess: "metadata.difficulties",
          align: "left",
          sortable: false,
          searchPrefix: ["difficulties", "diff"],
          requiresPrefix: true,
          globalSearch: (value: any, query: string) =>
            FilterDifficulties(value.difficulties, query.split("|")),
          width: 110,
        },
        {
          value: "playlists",
          text: "Playlists",
          template: BeatmapsTableHeadersTemplate.Playlists,
          align: "left",
          sortable: false,
          width: 110,
        },
        {
          value: "dl",
          text: "Downloads",
          template: BeatmapsTableHeadersTemplate.Text,
          templateItemAccess: "stats.downloads",
          align: "center",
          sortable: true,
          searchPrefix: ["dl", "downloads"],
          globalSearch: (value: any, query: number) =>
            FilterRange(value.downloads, query),
          sort: sortNumber,
          width: 50,
        },
        {
          value: "plays",
          text: "Plays",
          template: BeatmapsTableHeadersTemplate.Text,
          templateItemAccess: "stats.plays",
          align: "center",
          sortable: true,
          sort: sortNumber,
          width: 50,
        },
        {
          value: "upvotes",
          text: "Up votes",
          template: BeatmapsTableHeadersTemplate.Text,
          templateItemAccess: "stats.upVotes",
          align: "center",
          sortable: true,
          sort: sortNumber,
          width: 50,
        },
        {
          value: "downvotes",
          text: "Down votes",
          template: BeatmapsTableHeadersTemplate.Text,
          templateItemAccess: "stats.downVotes",
          align: "center",
          sortable: true,
          sort: sortNumber,
          width: 50,
        },
        {
          value: "rating",
          text: "Rating",
          template: BeatmapsTableHeadersTemplate.Rating,
          templateItemAccess: "stats.rating",
          align: "center",
          sortable: true,
          sort: sortNumber,
          width: 50,
        },
        {
          value: "uploaded",
          text: "Uploaded",
          template: BeatmapsTableHeadersTemplate.StrToDate,
          templateItemAccess: "uploaded",
          align: "center",
          sortable: true,
          globalSearch: (value: any, query: string) =>
            FilterDateRange(undefined, new Date(query)),
          sort: sortDateFromString,
          width: 150,
        },
        {
          value: "key",
          text: "Key",
          template: BeatmapsTableHeadersTemplate.Text,
          templateItemAccess: "key",
          align: "center",
          sortable: false,
          globalSearch: (value: any, query: string) =>
            FilterText(value.key, query),
          sort: sortNumber,
          width: 50,
        },
        {
          value: "hash",
          text: "Hash",
          template: BeatmapsTableHeadersTemplate.Text,
          templateItemAccess: "hash",
          align: "center",
          sortable: false,
          filterType: BeatmapsTableFilterType.Text,
          globalSearch: (value: any, query: string) =>
            FilterText(value.hash, query),
          sort: sortNumber,
          width: 300,
        },
        {
          value: "actions",
          text: "Actions",
          align: "center",
          sortable: false,
          filterable: false,
          width: 50,
        },
      ] as BeatmapsTableHeader[];
    },
    beatmapAsTableData(): { raw: BeatmapsTableDataUnit }[] {
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
    beatmapAsTableDataFiltered(): { raw: BeatmapsTableDataUnit }[] {
      if (!this.search) {
        return this.beatmapAsTableData;
      }

      return this.filterWithSearch();
    },
  },
  watch: {
    selectedItem() {
      this.$emit(
        "update:selected",
        this.selectedItem.map((entry: any) => entry.raw.data)
      );
    },
    page() {
      this.$emit("update:page", this.page);
      this.currentPage = this.page;
    },
  },
  methods: {
    headerToSlotName(header: any): string {
      return `item.${header.value}`;
    },
    getHeaders(): BeatmapsTableHeader[] {
      return this.headers.filter(
        (header) =>
          this.shownColumn.includes(header.value) || header.value === "actions"
      );
    },
    updatePage(page: number): void {
      this.$emit("update:page", page);
    },
    selectAllItems(select: boolean): void {
      if (select) {
        this.$emit(
          "update:selected",
          this.beatmapAsTableDataFiltered.map((item) => item.raw.data)
        );
      } else {
        this.$emit("update:selected", []);
      }
    },
    selectThisItem(item: BeatsaverBeatmap, enabled: boolean) {
      if (enabled) {
        this.$emit("update:selected", [...this.selected, item]);
      } else {
        this.$emit(
          "update:selected",
          this.selected.filter(
            (selectedItem: BeatsaverBeatmap) => selectedItem.hash !== item.hash
          )
        );
      }
    },
    filterWithSearch(): { raw: BeatmapsTableDataUnit }[] {
      return filter(this.search, this.headers, this.beatmapAsTableData);
    },
  },
});
</script>

<style>
td,
th {
  padding-left: 4px !important;
  padding-right: 4px !important;
}

td:first-child,
th:first-child {
  padding-left: 16px !important;
}

td:last-child,
th:last-child {
  padding-right: 16px !important;
}
</style>
