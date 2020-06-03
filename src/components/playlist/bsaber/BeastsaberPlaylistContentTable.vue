<template>
  <div>
    <BeatmapsTableOuterHeader
      :shown-column.sync="shownColumn"
      :search.sync="search"
    />
    <BeatmapsTable
      :items="beatmaps"
      :shown-column="shownColumn"
      :items-per-page.sync="itemsPerPage"
      :selected.sync="selectedBeatmap"
      :search="search"
      :see-more-route-name="seeMoreRouteName"
    >
      <template #actions="{ beatsaver }">
        <BeatmapDownloadButton :beatmap="beatsaver" small />
        <BeatmapButtonOpenPreview :beatmap="beatsaver" small />
      </template>
    </BeatmapsTable>
    <BeatmapsTableBulkActions
      :selected="selectedBeatmap"
      bulk-download
      @onDone="selectedBeatmap = []"
    />
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from "vue";
import { BeatsaverBeatmap } from "@/libraries/net/beatsaver/BeatsaverBeatmap";
import BeatmapsTable from "@/components/beatmap/table/BeatmapsTable.vue";
import BeatmapsTableOuterHeader from "@/components/beatmap/table/core/BeatmapsTableOuterHeader.vue";
import BeatmapsTableBulkActions from "@/components/beatmap/table/core/BeatmapsTableBulkActions.vue";
import { sync } from "vuex-pathify";
import PlaylistMapsLibrary from "@/libraries/playlist/PlaylistMapsLibrary";
import { PlaylistLocal } from "@/libraries/playlist/PlaylistLocal";
import BeatmapDownloadButton from "@/components/downloads/BeatmapDownloadButton.vue";
import BeatmapButtonOpenPreview from "@/components/beatmap/info/button/BeatmapButtonOpenPreview.vue";
import route from "@/plugins/route/route";

export default Vue.extend({
  name: "BeastsaberPlaylistContentTable",
  components: {
    BeatmapsTable,
    BeatmapsTableOuterHeader,
    BeatmapsTableBulkActions,
    BeatmapDownloadButton,
    BeatmapButtonOpenPreview,
  },
  props: {
    playlist: { type: Object as PropType<PlaylistLocal>, required: true },
  },
  data: () => ({
    selectedBeatmap: [] as BeatsaverBeatmap[],
    search: "",
  }),
  computed: {
    shownColumn: sync<string[]>(
      "settings/beatmapsTable@beastsaberPlaylistContent.shownColumn"
    ),
    itemsPerPage: sync<string[]>(
      "settings/beatmapsTable@beastsaberPlaylistContent.itemsPerPage"
    ),
    beatmaps() {
      return PlaylistMapsLibrary.GetAllValidMapAsTableDataFor(this.playlist);
    },
    seeMoreRouteName: () => route.BEATMAPS_ONLINE_UNIT,
  },
});
</script>
