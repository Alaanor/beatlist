<template>
  <v-container ma-0 pa-0 v-if="!!song">
    <v-layout>
      <v-flex xs12 md6>
        <table>
          <tr>
            <td class="body-2 pr-2">Name</td>
            <td class="body-1 pl-2">{{song.metadata.songName}}</td>
          </tr>
          <tr>
            <td class="body-2 pr-2">Author</td>
            <td class="body-1 pl-2">{{song.metadata.songAuthorName}}</td>
          </tr>
          <tr>
            <td class="body-2 pr-2">Mapper</td>
            <td class="body-1 pl-2">{{song.metadata.levelAuthorName}}</td>
          </tr>
          <tr>
            <td class="body-2 pr-2">BPM</td>
            <td class="body-1 pl-2">{{song.metadata.bpm}}</td>
          </tr>
          <tr>
            <td class="body-2 pr-2">Key</td>
            <td class="body-1 pl-2">{{song.key}}</td>
          </tr>
          <tr>
            <td class="body-2 pr-2">Difficulties</td>
            <td>
              <DifficultiesBadge :data="song.metadata.difficulties"></DifficultiesBadge>
            </td>
          </tr>
        </table>
      </v-flex>
      <v-flex xs12 md6>
        <table>
          <tr>
            <td class="body-2 pr-2">Uploaded</td>
            <td class="body-1 pl-2">{{song.uploaded | PrettyDateTime}}</td>
          </tr>
          <tr>
            <td class="body-2 pr-2">Download</td>
            <td class="body-1 pl-2">{{song.stats.downloads}}</td>
          </tr>
          <tr>
            <td class="body-2 pr-2">Plays</td>
            <td class="body-1 pl-2">{{song.stats.plays}}</td>
          </tr>
          <tr>
            <td class="body-2 pr-2">upVotes</td>
            <td class="body-1 pl-2">{{song.stats.upVotes}}</td>
          </tr>
          <tr>
            <td class="body-2 pr-2">downVotes</td>
            <td class="body-1 pl-2">{{song.stats.downVotes}}</td>
          </tr>
          <tr>
            <td class="body-2 pr-2">Rating</td>
            <td class="body-1 pl-2">{{song.stats.rating | Percent}}</td>
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
        <td class="body-1 pl-2" v-html="FormatNewLine(song.description)"></td>
      </v-flex>
    </v-layout>
  </v-container>
  <v-container v-else-if="err" ma-0 pa-0>
    <v-alert type="warning" :value="true" outline>
      Couldn't fetch data on beatsaver.com, try later ?
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
  import BeatSaverAPI from '../lib/BeatSaverAPI';
  import DifficultiesBadge from '@/components/DifficultiesBadge.vue';

  export default Vue.extend({
    name: 'BeatSaverSongInfo',
    components: {DifficultiesBadge},
    props: {
      hash: {type: String, required: true},
    },
    data: () => ({
      song: undefined,
      err: undefined,
    }),
    watch: {
      hash() {
        this.song = undefined;
        BeatSaverAPI.Singleton.getSongByHash(this.hash)
          .then((data) => this.song = data)
          .catch((err) => this.err = err);
      },
    },
    methods: {
      FormatNewLine(x) {
        return x.replace(/\r\n/g, '<br>')
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
