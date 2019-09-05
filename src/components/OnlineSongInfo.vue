<template>
  <v-card>
    <v-card-title>
      <div class="title">Song info</div>
      <v-spacer></v-spacer>
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
                <td class="body-2 pr-2">Download</td>
                <td class="body-1 pl-2">{{songData.stats.downloads}}</td>
              </tr>
              <tr>
                <td class="body-2 pr-2">Plays</td>
                <td class="body-1 pl-2">{{songData.stats.plays}}</td>
              </tr>
              <tr>
                <td class="body-2 pr-2">upVotes</td>
                <td class="body-1 pl-2">{{songData.stats.upVotes}}</td>
              </tr>
              <tr>
                <td class="body-2 pr-2">downVotes</td>
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
            <td class="body-1 pl-2" v-html="FormatNewLine(songData.description)"></td>
          </v-flex>
        </v-layout>
      </v-container>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <slot name="action"></slot>
    </v-card-actions>
  </v-card>
</template>

<script>
  import Vue from 'vue';
  import DifficultiesBadge from '@/components/DifficultiesBadge.vue';
  import SongLocal from '@/lib/data/SongLocal';
  import SongLoader from '@/lib/SongLoader';
  import {shell} from 'electron';

  export default Vue.extend({
    name: 'OnlineSongInfo',
    components: {DifficultiesBadge},
    props: {
      song: {type: Object},
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
    },
    methods: {
      UpdateComponent() {
        this.songData = this.song;
      },
      FormatNewLine(x) {
        return x
          .replace(/\r\n/g, '<br>')
          .replace(/\n/g, '<br>');
      },
      async refreshData() {
        await SongLoader.UpdateOnlineDataFor(this.song);
      },
      openLink(link) {
        shell.openExternal(link);
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
