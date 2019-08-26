<template>
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
  <v-container v-else-if="!song" ma-0 pa-0>
    <v-alert type="warning" :value="true" outline>
      Meh, I couldn't load data :(
    </v-alert>
  </v-container>
  <v-container v-else>
    <v-layout justify-center>
      <v-progress-circular indeterminate></v-progress-circular>
    </v-layout>
  </v-container>
</template>

<script>
  import Vue from 'vue';
  import DifficultiesBadge from '@/components/DifficultiesBadge.vue';
  import BeatSaverAPI from '@/lib/BeatSaverAPI';

  export default Vue.extend({
    name: 'OnlineSongInfo',
    components: {DifficultiesBadge},
    props: {
      song: {type: Object},
      hash: {type: String}
    },
    data: () => ({
      err: undefined,
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
    methods: {
      UpdateComponent() {
        if (this.song !== undefined) {
          this.songData = this.song;
        } else if (this.hash !== undefined) {
          BeatSaverAPI.Singleton
            .getSongByHash(this.hash)
            .then((s) => this.songData = s);
        }
      },
      FormatNewLine(x) {
        return x.replace(/\r\n/g, '<br>');
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
