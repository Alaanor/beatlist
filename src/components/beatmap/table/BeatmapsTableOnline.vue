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
    <v-alert
      v-if="error"
      text
      type="warning"
    >
      {{ error }}
    </v-alert>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue';
import { sync } from 'vuex-pathify';
import BeatmapsTable from '@/components/beatmap/table/BeatmapsTable.vue';
import BeatmapsTableColumnSelector from '@/components/beatmap/table/core/BeatmapsTableColumnSelector.vue';
import Tooltip from '@/components/helper/Tooltip.vue';
import BeatsaverAPI, { BeatSaverAPIResponse, BeatSaverAPIResponseStatus } from '@/libraries/net/beatsaver/BeatsaverAPI';
import { BeatsaverPage } from '@/libraries/net/beatsaver/BeatsaverBeatmap';
import { BeatmapsTableDataUnit } from '@/components/beatmap/table/core/BeatmapsTableDataUnit';
import BeatsaverUtilities from '@/libraries/net/beatsaver/BeatsaverUtilities';

export default Vue.extend({
  name: 'BeatmapTableLocal',
  components: { BeatmapsTableColumnSelector, BeatmapsTable, Tooltip },
  data: () => ({
    selectedMode: 'hot',
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
    error: undefined as string | undefined,
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
    selectedMode(): void {
      if (['hot', 'rating', 'latest', 'download', 'plays'].indexOf(this.selectedMode) !== -1) {
        this.fetchData();
      }
    },
  },
  mounted(): void {
    this.fetchData();
  },
  methods: {
    fetchData(): void {
      this.loading = true;
      let request = undefined as Promise<BeatSaverAPIResponse<BeatsaverPage>> | undefined;

      switch (this.selectedMode) {
        case 'search':
          request = BeatsaverAPI.Singleton.searchBeatmaps(this.search, this.currentPage - 1);
          break;

        case 'hot':
          request = BeatsaverAPI.Singleton.getByHot(this.currentPage - 1);
          break;

        case 'rating':
          request = BeatsaverAPI.Singleton.getByRating(this.currentPage - 1);
          break;

        case 'latest':
          request = BeatsaverAPI.Singleton.getByLatest(this.currentPage - 1);
          break;

        case 'download':
          request = BeatsaverAPI.Singleton.getByDownloads(this.currentPage - 1);
          break;

        case 'plays':
          request = BeatsaverAPI.Singleton.getByPlays(this.currentPage - 1);
          break;

        case 'key':
        case 'hash':
          break;

        default: break;
      }

      if (request) {
        this.handleBeatsaverPageResponse(request);
      }
    },
    handleBeatsaverPageResponse(response: Promise<BeatSaverAPIResponse<BeatsaverPage>>): void {
      response
        .then((value) => {
          this.error = BeatsaverUtilities.ErrorToMessage(value);

          if (value.status === BeatSaverAPIResponseStatus.ResourceFound) {
            this.beatsaverPage = value.data;
          } else {
            this.beatsaverPage = undefined;
          }
        }).finally(() => {
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
