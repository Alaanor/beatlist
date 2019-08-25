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
    </ListViewerForSongs>
  </v-container>
</template>

<script>
  import Vue from 'vue';
  import ListViewerForSongs from '@/components/ListViewerForSongs.vue';
  import BeatSaverAPI from '../lib/BeatSaverAPI';

  export default Vue.extend({
    name: 'SongListOnline',
    components: {ListViewerForSongs},
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

        if (options !== undefined)
          this.page = options.page - 1;

        let results = {};
        if (this.search.length !== 0)
          results = BeatSaverAPI.Singleton.search(this.search, this.page);
        else
          results = BeatSaverAPI.Singleton.getHot(this.page);

        results.then((result) => {
          this.items = result.docs;
          this.total = result.totalDocs;
          this.loading = false;
        });
      },
      updateSearch(str) {
        this.search = str;
        this.updatePagination();
      }
    },
    mounted() {
      this.updatePagination();
    },
  });
</script>
