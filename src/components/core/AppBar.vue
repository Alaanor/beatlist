<template>
  <v-app-bar
    app
    dense
    flat
    fixed
    clipped-left
    clipped-right
    class="windows-draggable"
    color="primary"
    height="24"
  >
    <v-toolbar-title>
      <v-img
        :src="logo"
        class="ml-2"
        width="24"
      />
    </v-toolbar-title>
    <v-spacer />
    <v-btn
      icon
      class="btn-win-control ma-0 win-ctrl"
      width="24"
      height="24"
      @click="toggleMinimize()"
    >
      <v-icon x-small>
        minimize
      </v-icon>
    </v-btn>
    <v-btn
      icon
      class="btn-win-control ma-0 win-ctrl"
      width="24"
      height="24"
      @click="toggleMaximized()"
    >
      <v-icon x-small>
        web_asset
      </v-icon>
    </v-btn>
    <v-hover v-slot:default="{ hover }">
      <v-btn
        icon
        :color="hover ? 'close' : ''"
        class="btn-win-control ma-0 win-ctrl"
        width="24"
        height="24"
        @click="appClose()"
      >
        <v-icon x-small>
          close
        </v-icon>
      </v-btn>
    </v-hover>
  </v-app-bar>
</template>

<script>
import Vue from 'vue';
import { remote } from 'electron';
import { get } from 'vuex-pathify';

const logo = require('assets/logo.png');

export default Vue.extend({
  name: 'AppBar',
  computed: {
    logo: () => logo,
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

header > .v-toolbar__content {
  padding: 0px;
}

.win-ctrl {
  border-radius: 0 !important;
}
</style>
