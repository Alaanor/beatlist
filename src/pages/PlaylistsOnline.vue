<template>
  <v-container>
    <span class="display-2">Online playlists</span><br>
    <span class="subtitle-1 grey--text">Content from <span @click="openUrl()">bsaber.com</span></span>

    {{isDownloaded}}
    <v-progress-circular v-if="playlists === []" :size="50" indeterminate></v-progress-circular>
    <v-alert v-else-if="!playlists" type="warning" class="mt-5">Couldn't load playlists :/</v-alert>
    <v-slide-group v-else class="mt-5" show-arrows :mandatory="forceSelected" center-active>
      <v-slide-item v-for="pl in playlists" v-model="playlistSelected" v-slot:default="{active, toggle}">
        <v-card width="200" class="mx-3" @click.stop="toggle" :raised="active" @click="showPlaylist(pl)">
          <v-img :src="pl.image" width="200" height="140"
                 :gradient="`rgba(0, 0, 0, 0) 50%, rgb(66, 66, 66)`">
            <v-overlay absolute :value="active" :opacity="0.7">
              <v-row class="fill-height" align="center" justify="center">
                <v-scale-transition>
                  <v-btn v-if="active" icon x-large :disabled="playlist === 'loading' || isDownloaded">
                    <v-icon color="success" x-large @click="installPlaylist()">{{isDownloaded ? 'done' : 'file_download'}}</v-icon>
                  </v-btn>
                </v-scale-transition>
              </v-row>
            </v-overlay>
          </v-img>
          <v-card-title class="subtitle-1 mt-n3" style="height: 75px">{{pl.playlistTitle}}</v-card-title>
          <v-card-text class="pb-0">
            <table>
              <tr>
                <td valign="top" class="pr-2">
                  <v-icon small>person</v-icon>
                </td>
                <td><span class="body-2">{{pl.playlistAuthor}}</span></td>
              </tr>
              <tr>
                <td valign="top">
                  <v-icon small>music_note</v-icon>
                </td>
                <td><span class="body-2">{{pl.playlistSongCount}} beatmaps</span></td>
              </tr>
              <tr>
                <td valign="top">
                  <v-icon small>event_note</v-icon>
                </td>
                <td><span class="body-2">{{pl.playlistDate.toLocaleString()}}</span></td>
              </tr>
              <tr>
                <td valign="top">
                  <v-icon small>category</v-icon>
                </td>
                <td><span class="body-2">{{pl.playlistCategory}}</span></td>
              </tr>
              <tr>
                <td valign="top">
                  <v-icon small>short_text</v-icon>
                </td>
                <td><span class="body-2">{{pl.playlistDescription}}</span></td>
              </tr>
            </table>
          </v-card-text>
        </v-card>
      </v-slide-item>
    </v-slide-group>

    <v-row class="fill-height" align="center" justify="center">
      <v-col cols="12">
        <div v-if="playlist === 'loading'" class="d-flex justify-center">
          <v-progress-circular class="mt-5" color="grey" :size="50" indeterminate></v-progress-circular>
        </div>
        <v-alert v-else-if="playlist === 'failed'" type="warning" class="mt-5">Couldn't load playlist :/</v-alert>
        <div v-else-if="!!playlist" class="mt-10">
          <span class="headline grey--text">Content of <span
                  class="white--text">{{playlist.playlistTitle}}</span></span>
          <ListViewerForSongSimple class="mt-5" :songs="playlist.songs">
            <template #actions="{item}">
              <BtnDownloadBeatMap :beatmap="item" download-only show-tick-if-downloaded></BtnDownloadBeatMap>
            </template>
          </ListViewerForSongSimple>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
  import Vue from 'vue';
  import BSaberAPI from '@/lib/BSaberAPI';
  import ListViewerForSongSimple from '@/components/ListViewerForSongSimple';
  import BtnDownloadBeatMap from '@/components/BtnDownloadBeatMap';
  import PlaylistOnline from '@/lib/PlaylistOnline';

  export default Vue.extend({
    name: 'PlaylistsOnline',
    components: {ListViewerForSongSimple, BtnDownloadBeatMap},
    data: () => ({
      forceSelected: false,
      playlists: [],
      playlist: undefined,
      playlistSelected: null,
    }),
    computed: {
      isDownloaded() {
        return !!this.playlist && this.playlist instanceof PlaylistOnline && this.playlist.IsDownloaded();
      }
    },
    mounted() {
      BSaberAPI.Singleton
        .getPlaylists()
        .then((data) => this.playlists = data);
    },
    methods: {
      showPlaylist(playlist) {
        this.forceSelected = true;
        this.playlist = 'loading';
        BSaberAPI.Singleton
          .getPlaylist(playlist)
          .then((p) => this.playlist = p)
          .catch(() => this.playlist = 'failed');
      },
      installPlaylist() {
        this.playlist.InstallIt();
      },
    },
  });
</script>

<style scoped>
  .v-card--link:focus:before {
    opacity: 0 !important;
  }
</style>
