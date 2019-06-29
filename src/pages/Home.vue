<template>
  <v-container>
    <v-layout justify-center align-center>
      <v-flex shrink>
        <v-img :src="require('@/assets/logo.png')" heigth="128" width="128"/>
        <h1 class="text-xs-center">Beatlist</h1>
      </v-flex>
    </v-layout>
    <br>
    <v-layout>
      <v-flex xs6 offset-xs3 id="markdown" v-if="!!changelogRaw" v-html="changelog"></v-flex>
      <v-flex v-if="hasErr" class="text-xs-center">
        <span class="warning--text subheading">Unfortunately, couldn't fetch the CHANGELOG.md</span><br>
        <span class="caption">You can always check the <a href="https://github.com/Alaanor/beatlist" target="_blank">Github repo</a>.</span>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
  import Vue from 'vue';
  import marked from 'marked';
  import axios from 'axios';

  export default Vue.extend({
    name: 'Home',
    data: () => ({
      changelogRaw: undefined,
      hasErr: false,
    }),
    computed: {
      changelog() {
        return marked(this.changelogRaw, { breaks: true, headerIds: false, sanitize: true });
      },
    },
    async mounted() {
      try{
        this.changelogRaw = await axios.get('https://raw.githubusercontent.com/Alaanor/beatlist/master/CHANGELOG.md');
      } catch (e) {
        this.changelogRaw = undefined;
        this.hasErr = true;
      }
    }
  });
</script>

<style scoped>
  #markdown >>> h1,
  #markdown >>> h2,
  #markdown >>> h3,
  #markdown >>> h4,
  #markdown >>> h5,
  #markdown >>> h6 {
    margin-bottom: 15px;
    margin-top: 15px;
  }
</style>
