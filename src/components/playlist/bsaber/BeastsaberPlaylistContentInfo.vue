<template>
  <div class="d-flex justify-center">
    <PlaylistCoverAvatar
      v-if="playlistLocal"
      :playlist="playlistLocal"
      :avatar-size="96"
      :icon-expand-size="24"
      style="margin-top: auto; margin-bottom: auto;"
    />
    <table style="max-width: 500px;" class="pl-5">
      <tr>
        <td>Title</td>
        <td>{{ playlistBeastsaber.playlistTitle }}</td>
      </tr>
      <tr>
        <td>Author</td>
        <td>{{ playlistBeastsaber.playlistAuthor }}</td>
      </tr>
      <tr>
        <td>Date</td>
        <td>{{ playlistBeastsaber.playlistDate }}</td>
      </tr>
      <tr>
        <td>Item(s)</td>
        <td>{{ playlistLocal ? playlistLocal.maps.length : "..." }}</td>
      </tr>
    </table>
    <table style="max-width: 700px;">
      <tr>
        <td>Category</td>
        <td>
          <v-chip small>{{ playlistBeastsaber.playlistCategory }}</v-chip>
        </td>
      </tr>
      <tr>
        <td>Description</td>
        <td>{{ playlistBeastsaber.playlistDescription }}</td>
      </tr>
    </table>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from "vue";
import BeastsaberPlaylist from "@/libraries/net/bsaber/BeastsaberPlaylist";
import PlaylistCoverAvatar from "@/components/playlist/cover/PlaylistCoverAvatar.vue";
import { PlaylistLocal } from "@/libraries/playlist/PlaylistLocal";

export default Vue.extend({
  name: "BeastsaberPlaylistContentInfo",
  components: {
    PlaylistCoverAvatar,
  },
  props: {
    playlistBeastsaber: {
      type: Object as PropType<BeastsaberPlaylist>,
      required: true,
    },
    playlistLocal: {
      type: Object as PropType<PlaylistLocal | undefined>,
      default: undefined,
    },
  },
});
</script>

<style scoped>
table tr td {
  font-size: 0.85rem;
}

table tr td:first-child {
  text-align: end;
  font-weight: bold;
  vertical-align: top;
}
</style>
