<template>
  <v-card flat>
    <v-form v-model="valid">
      <v-card-text>
        <v-container>
          <v-layout row align-center>
            <v-hover>
              <v-sheet slot-scope="{hover}" elevation="5" height="250" width="250" class="mr-5">
                <v-img v-if="imageData.length > 0" :src="imageData">
                  <v-expand-transition>
                    <div v-if="hover" class="d-flex transition-fast-in-fast-out black v-card--reveal">
                      <v-container>
                        <v-layout align-center justify-center>
                          <v-btn icon large>
                            <v-icon large>photo</v-icon>
                          </v-btn>
                        </v-layout>
                      </v-container>
                    </div>
                  </v-expand-transition>
                </v-img>
              </v-sheet>
            </v-hover>
            <v-flex>
              <v-text-field label="Title" :value="data.playlistTitle"></v-text-field>
              <v-text-field label="Author" :value="data.playlistAuthor"></v-text-field>
              <v-textarea label="Description" :value="data.playlistDescription"></v-textarea>
            </v-flex>
          </v-layout>
        </v-container>
      </v-card-text>
      <v-container>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="grey">Cancel</v-btn>
          <v-btn color="success">Save</v-btn>
        </v-card-actions>
      </v-container>
    </v-form>
  </v-card>
</template>

<script>
  import Vue from 'vue';
  import Playlist from '../lib/Playlist';

  export default Vue.extend({
    name: 'PlaylistEditorData',
    props: {data: {type: Object, required: true}},
    data: () => ({
      valid: false,
      imageData: '',
    }),
    methods: {
      LoadImage() {
        Playlist
          .LoadCover(this.data.playlistPath)
          .then((data) => this.imageData = data);
      },
    },
    mounted() {
      this.$nextTick(async function () {
        this.LoadImage();
      });
    },
  });
</script>

<style scoped>
  .v-card--reveal {
    align-items: center;
    bottom: 0;
    justify-content: center;
    opacity: .5;
    position: absolute;
    width: 100%;
    height: 100%;
  }
</style>
