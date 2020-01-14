<template>
  <v-container>
    <BeatmapsTableColumnSelector v-model="shownColumn"/>
    <v-card>
      <BeatmapsTable
        :items="beatmapAsTableData"
        :shown-column="shownColumn"
      />
    </v-card>
  </v-container>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import { sync } from 'vuex-pathify';
import { BeatmapsTableDataUnit } from '@/components/beatmap/table/core/BeatmapsTableDataUnit';
import BeatmapsTable from '@/components/beatmap/table/BeatmapsTable.vue';
import BeatmapsTableColumnSelector from '@/components/beatmap/table/BeatmapsTableColumnSelector.vue';

export default Vue.extend({
  name: 'BeatmapTableLocal',
  components: { BeatmapsTableColumnSelector, BeatmapsTable },
  props: {
    beatmaps: { type: Array as PropType<BeatmapsTableDataUnit[]>, required: true },
  },
  computed: {
    shownColumn: sync<string[]>('settings/beatmapsTable@shownColumn'),
    beatmapAsTableData() {
      return this.beatmaps.map((entry: BeatmapsTableDataUnit) => ({
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
  },
  methods: {
    // getHeaders() {
    //   return headers.filter((header) => this.shownColumn.includes(header.value));
    // },
  },
});
</script>
