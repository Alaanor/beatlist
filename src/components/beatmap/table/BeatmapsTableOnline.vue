<template>
  <v-container>
    <v-row>
      <v-col
        cols="auto"
        align-self="center"
      >
        <v-btn-toggle
          v-model="selectedMode"
          mandatory
        >
          <v-btn
            v-for="mode in modes"
            :key="mode.name"
            :value="mode.name"
            class="px-0"
            small
            icon
          >
            <Tooltip :text="mode.value">
              <v-icon
                v-if="mode.icon"
                small
              >
                {{ mode.icon }}
              </v-icon>
              <span v-else>{{ mode.text }}</span>
            </Tooltip>
          </v-btn>
        </v-btn-toggle>
      </v-col>
      <v-col>
        <v-text-field
          v-model="search"
          placeholder="Search"
          append-icon="search"
          height="20px"
          class="pa-0"
          :loading="loading"
          single-line
          hide-details
          filled
          rounded
          clearable
          dense
          @click:append="performSearch"
          @keydown.enter="performSearch"
          @click:clear="clearPage"
        />
      </v-col>
    </v-row>
    <BeatmapsTableColumnSelector v-model="shownColumn"/>
    <v-card>
      <BeatmapsTable
        :items="beatmaps"
        :shown-column="shownColumn"
        :server-items-length="totalDocs"
        :loading="loading"
        no-item-per-page-choice
        no-filter
        @update:page="updatePagination"
      />
    </v-card>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue';
import { sync } from 'vuex-pathify';
import BeatmapsTable from '@/components/beatmap/table/BeatmapsTable.vue';
import BeatmapsTableColumnSelector from '@/components/beatmap/table/core/BeatmapsTableColumnSelector.vue';
import Tooltip from '@/components/helper/Tooltip.vue';
import BeatsaverAPI, { BeatSaverAPIResponseStatus } from '@/libraries/net/beatsaver/BeatsaverAPI';
import { BeatsaverPage } from '@/libraries/net/beatsaver/BeatsaverBeatmap';
import { BeatmapsTableDataUnit } from '@/components/beatmap/table/core/BeatmapsTableDataUnit';

export default Vue.extend({
  name: 'BeatmapTableLocal',
  components: { BeatmapsTableColumnSelector, BeatmapsTable, Tooltip },
  data: () => ({
    selectedMode: 'search',
    modes: [
      { name: 'search', value: 'Search', icon: 'search' },
      { name: 'hot', value: 'Hot', icon: 'whatshot' },
      { name: 'rating', value: 'Rating', icon: 'star' },
      { name: 'latest', value: 'Latest', icon: 'new_releases' },
      { name: 'download', value: 'Download', icon: 'cloud_download' },
      { name: 'plays', value: 'Plays', icon: 'play_arrow' },
      { name: 'key', value: 'Key', icon: 'vpn_key' },
      { name: 'hash', value: 'Hash', text: '#' },
    ],
    search: '',
    beatsaverPage: undefined as BeatsaverPage | undefined,
    totalDocs: 0,
    currentPage: 1,
    loading: false,
  }),
  computed: {
    shownColumn: sync<string[]>('settings/beatmapsTable@shownColumn'),
    beatmaps(): BeatmapsTableDataUnit[] {
      return this.beatsaverPage?.docs.map((beatmap): BeatmapsTableDataUnit => ({
        local: undefined,
        data: beatmap,
      })) ?? [];
    },
  },
  watch: {
    beatsaverPage(): void {
      this.totalDocs = this.beatsaverPage?.totalDocs ?? 0;
    },
  },
  methods: {
    fetchData(): void {
      this.loading = true;
      BeatsaverAPI.Singleton.searchBeatmaps(this.search, this.currentPage - 1)
        .then((value) => {
          if (value.status === BeatSaverAPIResponseStatus.ResourceFound) {
            this.beatsaverPage = value.data;
          }
        })
        .finally(() => {
          this.loading = false;
        });
    },
    performSearch(): void {
      if (this.selectedMode !== 'search') {
        this.selectedMode = 'search';
      }

      this.fetchData();
    },
    updatePagination(page: number) {
      this.currentPage = page;
      this.fetchData();
    },
    clearPage() {
      this.beatsaverPage = undefined;
    },
  },
});
</script>
