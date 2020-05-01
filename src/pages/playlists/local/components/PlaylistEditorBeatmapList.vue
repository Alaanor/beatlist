<template>
  <div>
    <p class="headline">
      Content
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
        <BeatmapDownloadButton :beatmap="beatsaver" small />
        <PlaylistButtonRemoveFromPlaylist
          :playlist="playlist"
          :beatmap="beatsaver"
          small
        />
      </template>
    </BeatmapsTable>
    <BeatmapsTableBulkActions
      :playlist="playlist"
      :selected="selectedBeatmap"
      bulk-remove
      bulk-download
      @onDone="selectedBeatmap = []"
    />
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from "vue";
import { sync } from "vuex-pathify";
import { PlaylistLocal } from "@/libraries/playlist/PlaylistLocal";
import BeatmapsTable from "@/components/beatmap/table/BeatmapsTable.vue";
import PlaylistButtonRemoveFromPlaylist from "@/components/playlist/button/PlaylistButtonRemoveFromPlaylist.vue";
import PlaylistMapsLibrary from "@/libraries/playlist/PlaylistMapsLibrary";
import { BeatsaverBeatmap } from "@/libraries/net/beatsaver/BeatsaverBeatmap";
import BeatmapsTableBulkActions from "@/components/beatmap/table/core/BeatmapsTableBulkActions.vue";
import BeatmapsTableOuterHeader from "@/components/beatmap/table/core/BeatmapsTableOuterHeader.vue";
import BeatmapDownloadButton from "@/components/downloads/BeatmapDownloadButton.vue";

export default Vue.extend({
  name: "PlaylistEditorBeatmapList",
  components: {
    BeatmapsTable,
    BeatmapsTableOuterHeader,
    BeatmapsTableBulkActions,
    PlaylistButtonRemoveFromPlaylist,
    BeatmapDownloadButton,
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
      "settings/beatmapsTable@playlistContent.shownColumn"
    ),
    itemsPerPage: sync<string[]>(
      "settings/beatmapsTable@playlistContent.itemsPerPage"
    ),
    beatmaps() {
      return PlaylistMapsLibrary.GetAllValidMapAsTableDataFor(this.playlist);
    },
  },
});
</script>

<style scoped></style>
