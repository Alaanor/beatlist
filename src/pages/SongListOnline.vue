<template>
  <v-container>
    <span class="display-2">Online songs</span><br/>
    <span class="subtitle-1 grey--text">Content from <span @click="openUrl()">beatsaver.com</span></span>
    <ListViewerForSongs
            :items="items"
            :total="total"
            @paginate="updatePagination"
            :loading="loading"
            :items-per-page="10"
            :items-per-page-options="[10]"
            @updateSearch="updateSearch"
            :sort-by="sortBy">
      <template #item-block-action="{item}">
        <span class="pa-2">
          <OnlineSongQuickSummary :song="item" class="body-2"></OnlineSongQuickSummary>
        </span>
        <v-spacer></v-spacer>
        <span>
          <BtnAddSongToPlaylists v-if="isDownloaded(item)" :song="getLocal(item)" icon small></BtnAddSongToPlaylists>
        </span>
        <span class="pa-2">
          <BtnDownloadBeatMap :beatmap="item" small></BtnDownloadBeatMap>
        </span>
      </template>
      <template #item-list-action="{item}">
        <v-list-item-action-text>
          <span class="d-flex align-center pr-3">
            <OnlineSongQuickSummary :song="item" class="pr-4"></OnlineSongQuickSummary>
            <BtnDownloadBeatMap :beatmap="item" small></BtnDownloadBeatMap>
          </span>
        </v-list-item-action-text>
      </template>
      <template #sortBy>
        <div class="d-flex flex-row align-center">
          <v-overflow-btn solo :items="sortByElements" v-model="sortBy" class="mt-0" hide-details prefix="Browse by"
                          style="width: 265px;" :disabled="!!search">
          </v-overflow-btn>
          <span class="pl-5 body-1 grey--text">or</span>
        </div>
      </template>
    </ListViewerForSongs>
  </v-container>
</template>

<script>
  import Vue from 'vue';
  import ListViewerForSongs from '@/components/ListViewerForSongs.vue';
  import OnlineSongQuickSummary from '@/components/OnlineSongQuickSummary.vue';
  import BtnDownloadBeatMap from '@/components/BtnDownloadBeatMap';
  import BeatSaverAPI from '../lib/BeatSaverAPI';
  import BtnAddSongToPlaylists from '@/components/BtnToggleAddRemoveSongInPlaylists.vue';
  import SongLocal from '@/lib/data/SongLocal';

  export default Vue.extend({
    name: 'SongListOnline',
    components: {ListViewerForSongs, OnlineSongQuickSummary, BtnDownloadBeatMap, BtnAddSongToPlaylists},
    data: () => ({
      items: [],
      total: 0,
      loading: false,
      page: 0,
      search: '',
      sortByElements: [
        {value: 'hot', text: 'Hot'},
        {value: 'rating', text: 'Rating'},
        {value: 'latest', text: 'Latest'},
        {value: 'downloads', text: 'Downloads'},
        {value: 'plays', text: 'Plays'},
      ],
      sortBy: 'hot'
    }),
    methods: {
      updatePagination(options) {
        this.loading = true;

        if (options !== undefined) {
          this.page = options.page - 1;
        }

        let results = {};

        if (this.search.length !== 0) {
          results = BeatSaverAPI.Singleton.search(this.search, this.page);
        } else {
          switch (this.sortBy) {
            default:
            case 'hot':
              results = BeatSaverAPI.Singleton.getHot(this.page);
              break;
            case 'rating':
              results = BeatSaverAPI.Singleton.getRating(this.page);
              break;
            case 'latest':
              results = BeatSaverAPI.Singleton.getLatest(this.page);
              break;
            case 'downloads':
              results = BeatSaverAPI.Singleton.getDownloads(this.page);
              break;
            case 'plays':
              results = BeatSaverAPI.Singleton.getPlays(this.page);
              break;
          }
        }

        results.then((result) => {
          this.items = result.docs;
          this.total = result.totalDocs;
          this.loading = false;
        });
      },
      updateSearch(str) {
        this.search = str;
        this.updatePagination();
      },
      isDownloaded(beatmap) {
        return SongLocal.isInLibrary(beatmap);
      },
      getLocal(beatmap) {
        return SongLocal.get(beatmap);
      }
    },
    mounted() {
      this.updatePagination();
    },
  });
</script>
