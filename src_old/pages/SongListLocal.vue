<template>
  <v-container>
    <p class="display-2">Local songs</p>
    <ListViewerForLocalSongs>
      <template #item-block-action="{item}">
        <v-spacer></v-spacer>
        <div class="pa-2">
          <BtnAddSongToPlaylists :song="item" value="Add to playlist"></BtnAddSongToPlaylists>
        </div>
      </template>
      <template #item-list-action="{item}">
        <BtnAddSongToPlaylists :song="item" icon></BtnAddSongToPlaylists>
      </template>
    </ListViewerForLocalSongs>
  </v-container>
</template>

<script lang="ts">
  import Vue from 'vue';
  import DiscordRichPresence from '@/lib/ipc/DiscordRichPresence';
  import BtnAddSongToPlaylists from '@/components/BtnToggleAddRemoveSongInPlaylists.vue';
  import ListViewerForLocalSongs from '@/components/ListViewerForLocalSongs.vue';
  import {get} from 'vuex-pathify';

  export default Vue.extend({
    name: 'SongListLocal',
    components: {ListViewerForLocalSongs, BtnAddSongToPlaylists},
    computed: {
      songs: get('songs/songs'),
    },
    mounted() {
      const amount = this.songs.length;
      const plural = amount > 1 ? 's' : '';
      DiscordRichPresence.UpdateStatus(`Browsing local beatmap${plural}`, `Library: ${amount} beatmap${plural}`);
    },
  });
</script>
