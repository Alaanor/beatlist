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
      hide-default-footer
      fixed-header
      dense
    >
      <template #footer="{ props: { pagination } }">
        <v-divider/>
        <div class="d-flex justify-end align-center small-font py-1">
          <span>Rows per page:</span>
          <v-menu>
            <template #activator="{ on }">
              <v-btn
                small
                text
                outlined
                class="mx-3"
                v-on="on"
              >
                {{ itemsPerPage | withAll }}
              </v-btn>
            </template>
            <v-list>
              <v-list-item
                v-for="item in footerOptions.itemPerPageList"
                :key="item"
                @click="itemsPerPage = item"
              >
                <v-list-item-title>{{ item | withAll }}</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
          <span class="px-2">
            {{ `${pagination.pageStart+1}-${pagination.pageStop} of ${pagination.itemsLength}` }}
          </span>
          <v-btn
            icon
            small
            class="ml-2 mr-1"
            @click="options.page--"
          >
            <v-icon small>
              chevron_left
            </v-icon>
          </v-btn>
          <v-btn
            icon
            small
            class="ml-1 mr-5"
            @click="options.page++"
          >
            <v-icon small>
              chevron_right
            </v-icon>
          </v-btn>
        </div>
      </template>

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

      <template #item.dl="{ item }">
        {{ item.data.stats.downloads }}
      </template>

      <template #item.plays="{ item }">
        {{ item.data.stats.plays }}
      </template>

      <template #item.upvotes="{ item }">
        {{ item.data.stats.upVotes }}
      </template>

      <template #item.downvotes="{ item }">
        {{ item.data.stats.downVotes }}
      </template>
    </v-data-table>
  </v-container>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import { sync } from 'vuex-pathify';
import BeatmapCover from '@/components/beatmap/BeatmapCover.vue';
import DifficultiesChips from '@/components/beatmap/DifficultiesChips.vue';
import Tooltip from '@/components/helper/Tooltip.vue';
import { BeatmapsTableDataUnit } from '@/components/beatmap/table/BeatmapsTableDataUnit';

export default Vue.extend({
  name: 'BeatmapLocal',
  components: { BeatmapCover, DifficultiesChips, Tooltip },
  filters: {
    withAll(item: number): string {
      return item === -1 ? 'All' : item.toString();
    },
  },
  props: {
    beatmaps: { type: Array as PropType<BeatmapsTableDataUnit[]>, required: true },
  },
  data: () => ({
    availableColumn: [
      { name: 'Beatmap cover', value: 'cover' },
      { name: 'Song name', value: 'name' },
      { name: 'Artist', value: 'artist' },
      { name: 'Mapper', value: 'mapper' },
      { name: 'Difficulties', value: 'difficulties' },
      { name: 'Downloads', value: 'dl' },
      { name: 'Plays', value: 'plays' },
      { name: 'Up votes', value: 'upvotes' },
      { name: 'Down votes', value: 'downvotes' },
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
      {
        text: 'Downloads',
        value: 'dl',
        align: 'center',
        sortable: true,
      },
      {
        text: 'Plays',
        value: 'plays',
        align: 'center',
        sortable: true,
      },
      {
        text: 'Up votes',
        value: 'upvotes',
        align: 'center',
        sortable: true,
      },
      {
        text: 'Down votes',
        value: 'downvotes',
        align: 'center',
        sortable: true,
      },
    ],
    footerOptions: {
      itemPerPageList: [5, 10, 15, 20, 25, 50, 100, -1],
    },
    options: {
      page: 1,
    },
  }),
  computed: {
    shownColumn: sync<string[]>('settings/beatmapsTable@shownColumn'),
    itemsPerPage: sync<number>('settings/beatmapsTable@itemsPerPage'),
  },
  methods: {
    getHeaders() {
      return this.headers.filter((header) => this.shownColumn.includes(header.value));
    },
  },
});
</script>

<style scoped>
  .small-font {
    font-size: 12px;
  }
</style>
