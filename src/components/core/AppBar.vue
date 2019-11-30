<template>
  <v-app-bar app dense flat clipped-left class="windows-draggable"
             :color="darkTheme ? '#303030' : 'rgba(250, 250, 250, 0)'">
    <v-app-bar-nav-icon v-if="!permanent" @click.stop="drawer = !drawer" class="btn-win-control"/>
    <v-toolbar-title class="ma-1">
      <v-img :src="titleImage" width="108"/>
    </v-toolbar-title>
    <v-spacer/>
    <v-btn text icon @click="toggleMinimize()" class="btn-win-control ma-0">
      <v-icon small>minimize</v-icon>
    </v-btn>
    <v-btn text icon @click="toggleMaximized()" class="btn-win-control ma-0">
      <v-icon small>web_asset</v-icon>
    </v-btn>
    <v-hover v-slot:default="{ hover }">
      <v-btn text icon @click="appClose()" :color="hover ? 'error' : ''"
             class="btn-win-control ma-0">
        <v-icon small>close</v-icon>
      </v-btn>
    </v-hover>
  </v-app-bar>
</template>

<script>
import Vue from 'vue';
import { remote } from 'electron';
import { get } from 'vuex-pathify';

const titleWhite = require('../../assets/title_white.png');
const titleDark = require('../../assets/title_dark.png');

export default Vue.extend({
  name: 'AppBar',
  computed: {
    permanent: get('settings/permanent'),
    darkTheme: get('settings/darkTheme'),
    titleImage() {
      return this.darkTheme ? titleDark : titleWhite;
    },
  },
  methods: {
    toggleMinimize() {
      remote.getCurrentWindow().minimize();
    },
    toggleMaximized() {
      if (remote.getCurrentWindow().isMaximized()) {
        remote.getCurrentWindow().unmaximize();
      } else {
        remote.getCurrentWindow().maximize();
      }
    },
    appClose() {
      remote.getCurrentWindow().close();
    },
  },
});
</script>

<style>
  ::-webkit-scrollbar {
    display: none;
  }

  .windows-draggable {
    -webkit-app-region: drag;
  }

  .btn-win-control {
    -webkit-app-region: no-drag;
  }

  .no-text-selection {
    -webkit-user-select: none;
  }

  div.v-toolbar__content {
    padding-left: 5px;
  }
</style>
