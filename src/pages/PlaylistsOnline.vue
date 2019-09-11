<template>
  <v-container>
    <span class="display-2">Online playlists</span><br>
    <span class="subtitle-1 grey--text">Content from <span @click="openUrl()">bsaber.com</span></span>
    <v-slide-group class="mt-5" show-arrows center-active>
      <v-slide-item v-for="playlist in playlists" v-model="playlistSelected" v-slot:default="{active, toggle}">
        <v-card width="200" class="mx-3" @click.stop="toggle" :raised="active">
          <v-img :src="playlist.image" width="200" height="140" :gradient="`rgba(0, 0, 0, 0) 50%, rgb(66, 66, 66)`"></v-img>
          <v-card-title class="subtitle-1 mt-n3" style="height: 75px">{{playlist.playlistTitle}}</v-card-title>
          <v-card-text class="pb-0">
            <table>
              <tr>
                <td valign="top" class="pr-2"><v-icon small>person</v-icon></td>
                <td><span class="body-2">{{playlist.playlistAuthor}}</span></td>
              </tr>
              <tr>
                <td valign="top"><v-icon small>music_note</v-icon></td>
                <td><span class="body-2">{{playlist.playlistSongCount}} beatmaps</span></td>
              </tr>
              <tr>
                <td valign="top"><v-icon small>event_note</v-icon></td>
                <td><span class="body-2">{{playlist.playlistDate.toLocaleString()}}</span></td>
              </tr>
              <tr>
                <td valign="top"><v-icon small>category</v-icon></td>
                <td><span class="body-2">{{playlist.playlistCategory}}</span></td>
              </tr>
              <tr>
                <td valign="top"><v-icon small>short_text</v-icon></td>
                <td><span class="body-2">{{playlist.playlistDescription}}</span></td>
              </tr>
            </table>
          </v-card-text>
        </v-card>
      </v-slide-item>
    </v-slide-group>

  </v-container>
</template>

<script>
  import Vue from 'vue';
  import BSaberAPI from '@/lib/BSaberAPI';

  export default Vue.extend({
    name: 'PlaylistsOnline',
    data: () => ({
      playlists: [],
      playlistSelected: null,
    }),
    mounted() {
      BSaberAPI.Singleton
        .getPlaylists()
        .then((data) => this.playlists = data);
    }
  });
</script>

<style scoped>
  .v-card--link:focus:before {
    opacity: 0 !important;
  }
</style>
