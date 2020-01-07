<template>
  <v-container>
    <div class="d-flex align-center">
      <span class="mr-3 body-2">Column to show:</span>
      <v-chip-group
        v-model="selectedColumn"
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
    </div>
    <v-data-table
      :headers="getHeaders()"
      :items="beatmaps"
      fixed-header
      dense
    >
      <template #item.cover="{ item }">
        <BeatmapCover
          :beatmap="item.local || item.data"
          :avatar-size="24"
          :icon-expand-size="16"
        />
      </template>

      <template #item.difficulties="{ item }">
        <DifficultiesChips
          :diff="item.data.metadata.difficulties"
          small
          short
        />
      </template>

      <template #item.name="{ item }">
        <Tooltip :text="`${item.data.metadata.songName} - ${item.data.metadata.songSubName}`">
          <span>
            {{ item.data.metadata.songName }}
            <span class="caption grey--text">
              {{ item.data.metadata.songSubName }}
            </span>
          </span>
        </Tooltip>
      </template>

      <template #item.artist="{ item }">
        <Tooltip :text="item.data.metadata.songAuthorName">
          <span>
            {{ item.data.metadata.songAuthorName }}
          </span>
        </Tooltip>
      </template>

      <template #item.mapper="{ item }">
        <Tooltip :text="item.data.metadata.levelAuthorName">
          <span>
            {{ item.data.metadata.levelAuthorName }}
          </span>
        </Tooltip>
      </template>
    </v-data-table>
  </v-container>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import BeatmapCover from '@/components/beatmap/BeatmapCover.vue';
import DifficultiesChips from '@/components/beatmap/DifficultiesChips.vue';
import Tooltip from '@/components/helper/Tooltip.vue';
import { BeatmapsTableDataUnit } from '@/components/beatmap/table/BeatmapsTableDataUnit';

export default Vue.extend({
  name: 'BeatmapLocal',
  components: { BeatmapCover, DifficultiesChips, Tooltip },
  props: {
    beatmaps: { type: Array as PropType<BeatmapsTableDataUnit[]>, required: true },
  },
  data: () => ({
    selectedColumn: ['cover', 'name', 'mapper', 'difficulties'],
    availableColumn: [
      { name: 'Beatmap cover', value: 'cover' },
      { name: 'Song name', value: 'name' },
      { name: 'Artist', value: 'artist' },
      { name: 'Mapper', value: 'mapper' },
      { name: 'Difficulties', value: 'difficulties' },
    ],
    headers: [
      {
        text: 'Cover',
        value: 'cover',
        align: 'left',
        sortable: false,
        width: 48,
      },
      {
        text: 'Song name',
        value: 'name',
        align: 'left',
        sortable: true,
      },
      {
        text: 'Artist',
        value: 'artist',
        align: 'left',
        sortable: true,
      },
      {
        text: 'Mapper',
        value: 'mapper',
        align: 'left',
        sortable: true,
      },
      {
        text: 'Difficulties',
        value: 'difficulties',
        align: 'left',
        sortable: true,
      },
    ],
  }),
  methods: {
    getHeaders() {
      return this.headers.filter((header) => this.selectedColumn.includes(header.value));
    },
  },
});
</script>

<style scoped>

</style>
