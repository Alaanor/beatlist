<template>
  <v-container>
    <BeatmapsTableOuterHeader
      :shown-column.sync="shownColumn"
      :search.sync="search"
    />
    <v-card>
      <BeatmapsTable
        :items="beatmaps"
        :shown-column="shownColumn"
        :items-per-page.sync="itemsPerPage"
        :search="search"
        :page.sync="page"
        :see-more-route-name="seeMoreRouteName"
      >
        <template #actions="{ beatsaver }">
          <BeatmapButtonRemoveBeatmap :beatmap="beatsaver" small />
          <BeatmapButtonAddToNPlaylists :beatmap="beatsaver" small />
        </template>
      </BeatmapsTable>
    </v-card>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import { sync } from "vuex-pathify";
import BeatmapsTable from "@/components/beatmap/table/BeatmapsTable.vue";
import BeatmapLibrary from "@/libraries/beatmap/BeatmapLibrary";
import BeatmapsTableOuterHeader from "@/components/beatmap/table/core/BeatmapsTableOuterHeader.vue";
import BeatmapButtonAddToNPlaylists from "@/components/beatmap/button/BeatmapButtonAddToNPlaylists.vue";
import BeatmapButtonRemoveBeatmap from "@/components/beatmap/info/button/BeatmapButtonRemoveBeatmap.vue";
import route from "@/plugins/route/route";

export default Vue.extend({
  name: "BeatmapTableLocal",
  components: {
    BeatmapsTable,
    BeatmapsTableOuterHeader,
    BeatmapButtonAddToNPlaylists,
    BeatmapButtonRemoveBeatmap,
  },
  data: () => ({
    search: "",
    page: 1,
  }),
  computed: {
    shownColumn: sync<string[]>(
      "settings/beatmapsTable@localBeatmaps.shownColumn"
    ),
    itemsPerPage: sync<string[]>(
      "settings/beatmapsTable@localBeatmaps.itemsPerPage"
    ),
    beatmaps: () => BeatmapLibrary.GetAllValidBeatmapAsTableData(),
    seeMoreRouteName: () => route.BEATMAPS_LOCAL_UNIT,
  },
  watch: {
    search() {
      this.page = 1;
    },
  },
});
</script>
