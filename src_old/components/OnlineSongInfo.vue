<template>
  <v-card>
    <v-card-title>
      <div class="title">Song info</div>
      <v-spacer></v-spacer>
      <BtnDownloadBeatMap :beatmap="onlineBeatMap"></BtnDownloadBeatMap>
      <v-tooltip top v-if="isDownloaded">
        <template v-slot:activator="{ on }">
          <v-btn icon v-on="on" @click="openFolder()">
            <v-icon>folder</v-icon>
          </v-btn>
        </template>
        <span>Open this song in the file explorer</span>
      </v-tooltip>
      <v-tooltip top v-if="isDownloaded">
        <template v-slot:activator="{ on }">
          <v-btn icon v-on="on" @click="refreshData()">
            <v-icon>refresh</v-icon>
          </v-btn>
        </template>
        <span>Refresh the data</span>
      </v-tooltip>
      <v-tooltip top>
        <template v-slot:activator="{ on }">
          <v-btn icon v-on="on" @click="openLink(`https://skystudioapps.com/bs-viewer/?id=${song.key}`)">
            <v-icon>remove_red_eye</v-icon>
          </v-btn>
        </template>
        <span>Preview beatmap</span>
      </v-tooltip>
      <v-tooltip top>
        <template v-slot:activator="{ on }">
          <v-btn icon v-on="on" @click="openLink(`https://beatsaver.com/beatmap/${song.key}`)">
            <v-icon>open_in_new</v-icon>
          </v-btn>
        </template>
        <span>Open beatsaver.com link in browser</span>
      </v-tooltip>
    </v-card-title>
    <v-card-text>
      <v-container ma-0 pa-0 v-if="!!songData" style="-webkit-user-select: text">
        <v-layout>
          <v-flex xs12 md6>
            <table>
              <tr>
                <td class="body-2 pr-2">Name</td>
                <td class="body-1 pl-2">{{songData.metadata.songName}}</td>
              </tr>
              <tr>
                <td class="body-2 pr-2">Author</td>
                <td class="body-1 pl-2">{{songData.metadata.songAuthorName}}</td>
              </tr>
              <tr>
                <td class="body-2 pr-2">Mapper</td>
                <td class="body-1 pl-2">{{songData.metadata.levelAuthorName}}</td>
              </tr>
              <tr>
                <td class="body-2 pr-2">BPM</td>
                <td class="body-1 pl-2">{{songData.metadata.bpm}}</td>
              </tr>
              <tr>
                <td class="body-2 pr-2">Key</td>
                <td class="body-1 pl-2">{{songData.key}}</td>
              </tr>
              <tr>
                <td class="body-2 pr-2">Difficulties</td>
                <td>
                  <DifficultiesBadge :data="songData.metadata.difficulties"></DifficultiesBadge>
                </td>
              </tr>
            </table>
          </v-flex>
          <v-flex xs12 md6>
            <table>
              <tr>
                <td class="body-2 pr-2">Uploaded</td>
                <td class="body-1 pl-2">{{songData.uploaded | PrettyDateTime}}</td>
              </tr>
              <tr>
                <td class="body-2 pr-2">Downloads</td>
                <td class="body-1 pl-2">{{songData.stats.downloads}}</td>
              </tr>
              <tr>
                <td class="body-2 pr-2">Plays</td>
                <td class="body-1 pl-2">{{songData.stats.plays}}</td>
              </tr>
              <tr>
                <td class="body-2 pr-2">upvotes</td>
                <td class="body-1 pl-2">{{songData.stats.upVotes}}</td>
              </tr>
              <tr>
                <td class="body-2 pr-2">downvotes</td>
                <td class="body-1 pl-2">{{songData.stats.downVotes}}</td>
              </tr>
              <tr>
                <td class="body-2 pr-2">Rating</td>
                <td class="body-1 pl-2">{{songData.stats.rating | Percent}}</td>
              </tr>
            </table>
          </v-flex>
        </v-layout>
        <br>
        <v-divider></v-divider>
        <br>
        <v-layout column>
          <v-flex class="pb-3">
            <td class="body-2">Description</td>
          </v-flex>
          <v-flex>
            <td class="body-1 pl-2" v-html="Linkify(FormatNewLine(songData.description))"></td>
          </v-flex>
        </v-layout>
      </v-container>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <BtnAddSongToPlaylists v-if="isDownloaded" :song="localBeatMap" value="Add to playlist"></BtnAddSongToPlaylists>
      <v-btn text v-if="moreInfo" @click="getMoreInfo()">More info</v-btn>
      <slot name="action"></slot>
    </v-card-actions>
  </v-card>
</template>

<script>
  import Vue from 'vue';
  import DifficultiesBadge from '@/components/DifficultiesBadge.vue';
  import BtnAddSongToPlaylists from '@/components/BtnToggleAddRemoveSongInPlaylists.vue';
  import BtnDownloadBeatMap from '@/components/BtnDownloadBeatMap';
  import SongLocal from '@/lib/data/SongLocal';
  import SongLoader from '@/lib/SongLoader';
  import {shell} from 'electron';
  import linkifyHtml from 'linkifyjs/html';
  import SongOnline from '@/lib/data/SongOnline';

  export default Vue.extend({
    name: 'OnlineSongInfo',
    components: {DifficultiesBadge, BtnAddSongToPlaylists, BtnDownloadBeatMap},
    props: {
      song: {type: Object},
      moreInfo: {type: Boolean, default: true},
    },
    data: () => ({
      err: undefined,
      tmpData: undefined,
      songData: undefined,
    }),
    watch: {
      song() {
        this.UpdateComponent();
      },
      hash() {
        this.UpdateComponent();
      },
    },
    mounted() {
      this.UpdateComponent();
    },
    computed: {
      isDownloaded() {
        return SongLocal.isInLibrary(this.song);
      },
      localBeatMap() {
        return SongLocal.get(this.song);
      },
      onlineBeatMap() {
        return new SongOnline(SongLocal.isSongLocal(this.song) ? this.song.onlineData : this.song);
      },
    },
    methods: {
      UpdateComponent() {
        this.songData = this.onlineBeatMap;
      },
      FormatNewLine(x) {
        return x
          .replace(/\r\n/g, '<br>')
          .replace(/\n/g, '<br>');
      },
      async refreshData() {
        await SongLoader.UpdateOnlineDataFor(this.song);
      },
      getMoreInfo() {
        this.$router.push({name: 'beatmap', params: {key: this.song.key}});
      },
      openLink(link) {
        shell.openExternal(link);
      },
      openFolder() {
        shell.openItem(this.localBeatMap.path);
      },
      /**
       * @return {string}
       */
      Linkify(str) {
        return linkifyHtml(str);
      },
    },
    filters: {
      /** @return {string} */
      Percent(x) {
        return (x * 100).toFixed(2) + '%';
      },
      /** @return {string} */
      PrettyDateTime(x) {
        return new Date(x).toLocaleString();
      },
    },
  });
</script>

<style scoped>

</style>
