<template>
  <div>
    <p class="headline">
      Browser
    </p>
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
      see-more-route-name="beatmaps-online-unit"
    >
      <template #actions="{ beatsaver }">
        <PlaylistButtonAddToPlaylist
          :playlist="playlist"
          :beatmap="beatsaver"
          small
        />
      </template>
    </BeatmapsTable>
    <BeatmapsTableBulkActions
      :playlist="playlist"
      :selected="selectedBeatmap"
      bulk-add
      @onDone="selectedBeatmap = []"
    />
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from "vue";
import { sync } from "vuex-pathify";
import { PlaylistLocal } from "@/libraries/playlist/PlaylistLocal";
import BeatmapsTable from "@/components/beatmap/table/BeatmapsTable.vue";
import PlaylistButtonAddToPlaylist from "@/components/playlist/button/PlaylistButtonAddToPlaylist.vue";
import BeatmapLibrary from "@/libraries/beatmap/BeatmapLibrary";
import { BeatsaverBeatmap } from "@/libraries/net/beatsaver/BeatsaverBeatmap";
import BeatmapsTableBulkActions from "@/components/beatmap/table/core/BeatmapsTableBulkActions.vue";
import BeatmapsTableOuterHeader from "@/components/beatmap/table/core/BeatmapsTableOuterHeader.vue";

export default Vue.extend({
  name: "PlaylistEditorBeatmapBrowser",
  components: {
    BeatmapsTableOuterHeader,
    BeatmapsTable,
    PlaylistButtonAddToPlaylist,
    BeatmapsTableBulkActions,
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
      "settings/beatmapsTable@playlistBrowser.shownColumn"
    ),
    itemsPerPage: sync<string[]>(
      "settings/beatmapsTable@playlistBrowser.itemsPerPage"
    ),
    beatmaps: () => BeatmapLibrary.GetAllValidBeatmapAsTableData(),
  },
});
</script>

<style scoped></style>
