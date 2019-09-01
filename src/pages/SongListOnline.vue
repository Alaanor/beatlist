<template>
  <v-container>
    <h1>Online songs</h1>
    <ListViewerForSongs
            :items="items"
            :total="total"
            @paginate="updatePagination"
            :loading="loading"
            :items-per-page="10"
            :items-per-page-options="[10]"
            @updateSearch="updateSearch">
      <template #item-block-action="{item}">
        <span class="pa-2">
          <OnlineSongQuickSummary :song="item" class="body-2"></OnlineSongQuickSummary>
        </span>
        <v-spacer></v-spacer>
        <span class="pa-2">
          <v-btn icon small color="success" @click.stop="installBeatMap(item)">
            <v-icon>file_download</v-icon>
          </v-btn>
        </span>
      </template>
      <template #item-list-action="{item}">
        <v-list-item-action-text>
          <OnlineSongQuickSummary :song="item" class="pr-5"></OnlineSongQuickSummary>
          <v-btn icon color="success" @click.stop="installBeatMap(item)">
            <v-icon>file_download</v-icon>
          </v-btn>
        </v-list-item-action-text>
      </template>
    </ListViewerForSongs>
  </v-container>
</template>

<script>
  import Vue from 'vue';
  import ListViewerForSongs from '@/components/ListViewerForSongs.vue';
  import OnlineSongQuickSummary from '@/components/OnlineSongQuickSummary.vue';
  import BeatSaverAPI from '../lib/BeatSaverAPI';

  export default Vue.extend({
    name: 'SongListOnline',
    components: {ListViewerForSongs, OnlineSongQuickSummary},
    data: () => ({
      items: [],
      total: 0,
      loading: false,
      page: 0,
      search: '',
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
          results = BeatSaverAPI.Singleton.getHot(this.page);
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
      installBeatMap(beatmap) {
        beatmap.InstallIt();
      },
    },
    mounted() {
      this.updatePagination();
    },
  });
</script>
