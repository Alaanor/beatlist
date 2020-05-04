<template>
  <v-container>
    <v-row>
      <v-col cols="auto" align-self="center">
        <v-btn-toggle v-model="selectedMode" mandatory>
          <v-btn
            v-for="mode in modes"
            :key="mode.name"
            :value="mode.name"
            class="px-0"
            small
            icon
          >
            <Tooltip :text="mode.value">
              <v-icon v-if="mode.icon" small>
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
    <BeatmapsTableColumnSelector v-model="shownColumn" />
    <v-card>
      <BeatmapsTable
        :items="beatmaps"
        :shown-column="shownColumn"
        :items-per-page="10"
        :server-items-length="totalDocs"
        :loading="loading"
        see-more-route-name="beatmaps-online-unit"
        no-item-per-page-choice
        no-filter
        no-sort
        @update:page="updatePagination"
      >
        <template #actions="{ beatsaver }">
          <BeatmapButtonAddToNPlaylists :beatmap="beatsaver" small />
          <BeatmapDownloadButton :beatmap="beatsaver" auto-hide small />
          <BeatmapButtonRemoveBeatmap :beatmap="beatsaver" auto-hide small />
        </template>
      </BeatmapsTable>
    </v-card>
    <v-alert v-if="error" type="warning" border="left" class="mt-3" text>
      {{ error }}
    </v-alert>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import { sync } from "vuex-pathify";
import BeatmapsTable from "@/components/beatmap/table/BeatmapsTable.vue";
import BeatmapsTableColumnSelector from "@/components/beatmap/table/core/BeatmapsTableColumnSelector.vue";
import Tooltip from "@/components/helper/Tooltip.vue";
import BeatsaverAPI, {
  BeatSaverAPIResponse,
  BeatSaverAPIResponseStatus,
} from "@/libraries/net/beatsaver/BeatsaverAPI";
import {
  BeatsaverBeatmap,
  BeatsaverPage,
} from "@/libraries/net/beatsaver/BeatsaverBeatmap";
import { BeatmapsTableDataUnit } from "@/components/beatmap/table/core/BeatmapsTableDataUnit";
import BeatsaverUtilities from "@/libraries/net/beatsaver/BeatsaverUtilities";
import BeatmapDownloadButton from "@/components/downloads/BeatmapDownloadButton.vue";
import BeatmapButtonRemoveBeatmap from "@/components/beatmap/info/button/BeatmapButtonRemoveBeatmap.vue";
import BeatmapButtonAddToNPlaylists from "@/components/beatmap/button/BeatmapButtonAddToNPlaylists.vue";

export default Vue.extend({
  name: "BeatmapTableLocal",
  components: {
    BeatmapsTableColumnSelector,
    BeatmapsTable,
    Tooltip,
    BeatmapDownloadButton,
    BeatmapButtonRemoveBeatmap,
    BeatmapButtonAddToNPlaylists,
  },
  data: () => ({
    selectedMode: "hot",
    modes: [
      { name: "search", value: "Search", icon: "search" },
      { name: "hot", value: "Hot", icon: "whatshot" },
      { name: "rating", value: "Rating", icon: "star" },
      { name: "latest", value: "Latest", icon: "new_releases" },
      { name: "download", value: "Download", icon: "cloud_download" },
      { name: "plays", value: "Plays", icon: "play_arrow" },
      { name: "key", value: "Key", icon: "vpn_key" },
      { name: "hash", value: "Hash", text: "#" },
    ],
    search: "",
    beatsaverPage: undefined as BeatsaverPage | undefined,
    totalDocs: 0,
    currentPage: 1,
    loading: false,
    error: undefined as string | undefined,
  }),
  computed: {
    shownColumn: sync<string[]>(
      "settings/beatmapsTable@beatsaverBeatmaps.shownColumn"
    ),
    beatmaps(): BeatmapsTableDataUnit[] {
      return (
        this.beatsaverPage?.docs.map(
          (beatmap): BeatmapsTableDataUnit => ({
            local: undefined,
            data: beatmap,
          })
        ) ?? []
      );
    },
  },
  watch: {
    beatsaverPage(): void {
      this.totalDocs = this.beatsaverPage?.totalDocs ?? 0;
    },
    selectedMode(): void {
      if (
        ["hot", "rating", "latest", "download", "plays"].includes(
          this.selectedMode
        )
      ) {
        this.fetchData();
      }

      this.beatsaverPage = undefined;
    },
  },
  mounted(): void {
    this.fetchData();
  },
  methods: {
    fetchData(): void {
      this.loading = true;
      let requestPage = undefined as
        | Promise<BeatSaverAPIResponse<BeatsaverPage>>
        | undefined;
      let requestMap = undefined as
        | Promise<BeatSaverAPIResponse<BeatsaverBeatmap>>
        | undefined;

      switch (this.selectedMode) {
        case "search":
          requestPage = BeatsaverAPI.Singleton.searchBeatmaps(
            this.search,
            this.currentPage - 1
          );
          break;

        case "hot":
          requestPage = BeatsaverAPI.Singleton.getByHot(this.currentPage - 1);
          break;

        case "rating":
          requestPage = BeatsaverAPI.Singleton.getByRating(
            this.currentPage - 1
          );
          break;

        case "latest":
          requestPage = BeatsaverAPI.Singleton.getByLatest(
            this.currentPage - 1
          );
          break;

        case "download":
          requestPage = BeatsaverAPI.Singleton.getByDownloads(
            this.currentPage - 1
          );
          break;

        case "plays":
          requestPage = BeatsaverAPI.Singleton.getByPlays(this.currentPage - 1);
          break;

        case "key":
          requestMap = BeatsaverAPI.Singleton.getBeatmapByKey(this.search);
          break;

        case "hash":
          requestMap = BeatsaverAPI.Singleton.getBeatmapByHash(this.search);
          break;

        default:
          break;
      }

      if (requestPage) {
        this.handleBeatsaverPageResponse(requestPage);
      }

      if (requestMap) {
        this.handleBeatsaverBeatmapResponse(requestMap);
      }
    },
    handleBeatsaverPageResponse(
      response: Promise<BeatSaverAPIResponse<BeatsaverPage>>
    ): void {
      response
        .then((value) => {
          this.error = BeatsaverUtilities.ErrorToMessage(value);

          if (value.status === BeatSaverAPIResponseStatus.ResourceFound) {
            this.beatsaverPage = value.data;
          } else {
            this.beatsaverPage = undefined;
          }
        })
        .finally(() => {
          this.loading = false;
        });
    },
    handleBeatsaverBeatmapResponse(
      response: Promise<BeatSaverAPIResponse<BeatsaverBeatmap>>
    ) {
      response
        .then((value) => {
          this.error = BeatsaverUtilities.ErrorToMessage(value);

          if (value.status === BeatSaverAPIResponseStatus.ResourceFound) {
            this.beatsaverPage = BeatsaverUtilities.WrapInPage(value.data);
          } else if (
            value.status === BeatSaverAPIResponseStatus.ResourceNotFound
          ) {
            this.beatsaverPage = BeatsaverUtilities.GetEmptyPage();
            this.error =
              "No beatmap was found with this search (you are in Key or Hash mode !). Search must be exact in this mode.";
          } else {
            this.beatsaverPage = undefined;
          }
        })
        .finally(() => {
          this.loading = false;
        });
    },
    performSearch(): void {
      if (!["search", "key", "hash"].includes(this.selectedMode)) {
        this.selectedMode = "search";
      }

      if (this.search === "") {
        return;
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
