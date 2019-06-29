<template>
  <v-app :dark="settings.darkTheme" class="no-text-selection">
    <v-navigation-drawer v-model="drawer" clipped app :mini-variant="settings.miniVariant"
                         :permanent="settings.permanent">
      <v-list dense>
        <v-list-tile v-for="menu in menus" :to="menu.path" v-if="!(menu.requireValidConfig && !settings.configValid)">
          <v-list-tile-action>
            <v-icon>{{ menu.icon }}</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>{{ menu.name }}</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        <v-list-tile @click="openGithubRepo()">
          <v-list-tile-action>
            <v-icon>mdi-github-circle</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>Github repo</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
    <v-toolbar app fixed clipped-left dense flat class="windows-draggable">
      <v-toolbar-side-icon v-if="!settings.permanent" @click.stop="drawer = !drawer"
                           class="btn-win-control"></v-toolbar-side-icon>
      <v-toolbar-title>Beatlist</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn flat icon @click="toggleMinimize()" class="btn-win-control ma-0">
        <v-icon small>minimize</v-icon>
      </v-btn>
      <v-btn flat icon @click="toggleMaximized()" class="btn-win-control ma-0">
        <v-icon small>web_asset</v-icon>
      </v-btn>
      <v-btn flat icon @click="appClose()" class="btn-win-control ma-0">
        <v-icon small>close</v-icon>
      </v-btn>
    </v-toolbar>
    <v-content>
      <v-container fluid fill-height>
        <v-layout v-if="isReady">
          <v-flex lg8 xs12 offset-lg2>
            <keep-alive>
              <transition appear name="slide-x-transition" mode="out-in">
                <router-view></router-view>
              </transition>
            </keep-alive>
          </v-flex>
        </v-layout>
        <v-layout justify-center align-center v-else>
          <v-flex shrink>
            <v-progress-circular :size="100" :width="5" indeterminate></v-progress-circular>
          </v-flex>
        </v-layout>
      </v-container>
    </v-content>
    <v-footer app fixed>
      <v-spacer></v-spacer>
      <span class="mr-3">2019 - <strong>Beatlist</strong></span>
    </v-footer>
  </v-app>
</template>

<script lang="ts">
  import Vue from 'vue';
  import VueRouter from 'vue-router';
  import Home from '@/pages/Home.vue';
  import SongList from '@/pages/SongList.vue';
  import Playlists from '@/pages/Playlists.vue';
  import Settings from '@/pages/Settings.vue';
  import PlaylistEditor from '@/pages/PlaylistEditor.vue';
  import FAQ from '@/pages/FAQ.vue';
  import {get} from 'vuex-pathify';
  import store from '@/store/store';
  import {remote, shell} from 'electron';

  Vue.use(VueRouter);

  const router = new VueRouter({
    routes: [
      {
        path: '/',
        name: 'home',
        component: Home,
      },
      {
        path: '/song-list',
        name: 'song-list',
        component: SongList,
        meta: {requireValidSettings: true},
      },
      {
        path: '/playlist',
        name: 'playlist',
        component: Playlists,
        meta: {requireValidSettings: true},
      },
      {
        path: '/playlist/edit/:hash',
        name: 'playlistEditor',
        component: PlaylistEditor,
        meta: {requireValidSettings: true},
      },
      {
        path: '/settings',
        name: 'settings',
        component: Settings,
      },
      {
        path: '/faq',
        name: 'faq',
        component: FAQ,
      },
      {path: '*', redirect: '/'},
    ],
  });

  router.beforeEach((to, from, next) => {
    if (to.matched.some((record) => record.meta.requireValidSettings)) {
      const st = store as unknown as { get: (path: string) => boolean };
      if (!st.get('settings/configValid')) {
        next();
      } else {
        next();
      }
    } else {
      next();
    }
  });

  export default Vue.extend({
    router,
    data: () => ({
      drawer: null,
      isReady: false,
      menus: [
        {
          path: '/',
          name: 'Home',
          icon: 'home',

        },
        {
          path: '/song-list',
          name: 'Song list',
          icon: 'queue_music',
          requireValidConfig: true,
        },
        {
          path: '/playlist',
          name: 'Playlist',
          icon: 'playlist_play',
          requireValidConfig: true,
        },
        {
          path: '/faq',
          name: 'Frequently asked questions',
          icon: 'question_answer',
        },
        {
          path: '/settings',
          name: 'Settings',
          icon: 'settings',
        },
      ],
    }),
    computed: {
      settings: get('settings'),
    },
    mounted(): void {
      const st = this.$store as unknown as { _vm: { $root: Vue } };
      st._vm.$root.$on('storageReady', () => this.isReady = true);
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
      openGithubRepo() {
        shell.openExternal('https://github.com/Alaanor/beatlist');
      },
    },
  });
</script>

<style>
  /* Disable scrollbar */
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
</style>
