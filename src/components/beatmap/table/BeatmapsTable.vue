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
      :items="beatmaps"
      :options="{...options, itemsPerPage}"
      multi-sort
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
          :item="item"
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
import { headers } from './BeatmapsTableHeaders';
import BeatmapTableFooter from '@/components/beatmap/table/BeatmapsTableFooter.vue';
import BeatmapTableTemplateCover from '@/components/beatmap/table/template/BeatmapTableTemplateCover.vue';
import BeatmapTableTemplateText from '@/components/beatmap/table/template/BeatmapTableTemplateText.vue';
import BeatmapTableTemplateTextTooltip from '@/components/beatmap/table/template/BeatmapTableTemplateTextTooltip.vue';
import BeatmapTableTemplateBeatmapName from '@/components/beatmap/table/template/BeatmapTableTemplateBeatmapName.vue';
import BeatmapTableTemplateStrToDate from '@/components/beatmap/table/template/BeatmapTableTemplateStrToDate.vue';
import BeatmapTableTemplateDifficulties from '@/components/beatmap/table/template/BeatmapTableTemplateDifficulties.vue';

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
    shownColumn: sync<string[]>('settings/beatmapsTable@shownColumn'),
    itemsPerPage: sync<number>('settings/beatmapsTable@itemsPerPage'),
    availableColumn() {
      return headers.map((header) => ({
        name: header.text,
        value: header.value,
      }));
    },
  },
  methods: {
    getHeaders() {
      return headers.filter((header) => this.shownColumn.includes(header.value));
    },
    capitalizeFirstLetter(str: string) {
      return str.charAt(0).toUpperCase() + str.slice(1);
    },
    headerToSlotName(header: any): string {
      return `item.${header.value}`;
    },
  },
});
</script>
