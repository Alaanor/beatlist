<template>
  <v-hover>
    <v-card slot-scope="{hover}" v-if="data !== undefined"
            :class="`elevation-${hover ? 12 : 2}`"
            width="305px">
      <v-layout justify-space-between row align-center>
        <v-flex xs5 pa-0>
          <v-img v-if="imageData.length > 0" :src="imageData" height="100px" contain class="mx-3"></v-img>
        </v-flex>
        <v-flex xs7 pa-3>
          <div>
            <v-container pa-0>
              <div class="subheading">{{data.playlistTitle}}</div>
              <div class="caption">{{data.playlistAuthor}}</div>
            </v-container>
          </div>
        </v-flex>
        <v-flex>
          <v-btn icon>
            <v-icon>chevron_right</v-icon>
          </v-btn>
        </v-flex>
      </v-layout>
    </v-card>
  </v-hover>
</template>

<script>
  import Vue from 'vue';
  import Playlist from '../lib/Playlist';

  export default Vue.extend({
    name: 'Playlist',
    data: () => ({
      imageData: '',
    }),
    props: {data: {type: Object, required: true}},
    methods: {
      LoadImage() {
        const playlist = this.$props.data;
        Playlist
          .LoadCover(playlist.playlistPath)
          .then((data) => this.imageData = data);
      },
    },
    mounted() {
      this.$nextTick(async function () {
        this.LoadImage();
      });
    },
    watch: {
      data() {
        this.imageData = '';
        this.LoadImage();
      },
    },
  });
</script>
