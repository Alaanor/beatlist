<template>
  <v-app class="no-text-selection">
    <v-navigation-drawer app clipped floating v-model="drawer" :permanent="permanent" mini-variant-width="70"
                         :expand-on-hover="miniVariant" mobile-break-point="0" color="transparent">
      <v-card class="ml-2">
        <v-list dense>
          <MenuNavigationItem v-for="menu in menus" :item="menu"></MenuNavigationItem>
          <v-list-item @click="openGithubRepo()">
            <v-list-item-icon>
              <v-icon>mdi-github-circle</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>Github repo</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-card>

    </v-navigation-drawer>
    <v-app-bar app dense flat clipped-left class="windows-draggable" :color="darkTheme ? '#303030' : 'rgba(250, 250, 250, 0)'">
      <v-app-bar-nav-icon v-if="!permanent" @click.stop="drawer = !drawer" class="btn-win-control"></v-app-bar-nav-icon>
      <v-toolbar-title class="ma-1">
        <v-img :src="require(`@/assets/${darkTheme ? 'title_dark' : 'title_white'}.png`)" width="108"></v-img>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn text icon @click="toggleMinimize()" class="btn-win-control ma-0">
        <v-icon small>minimize</v-icon>
      </v-btn>
      <v-btn text icon @click="toggleMaximized()" class="btn-win-control ma-0">
        <v-icon small>web_asset</v-icon>
      </v-btn>
      <v-hover v-slot:default="{ hover }">
        <v-btn text icon @click="appClose()" :color="hover ? 'error' : ''" class="btn-win-control ma-0">
          <v-icon small>close</v-icon>
        </v-btn>
      </v-hover>
    </v-app-bar>
    <v-content>
      <v-container fluid fill-height>
        <v-layout v-if="isReady">
          <v-flex lg10 xs12 offset-lg1>
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
    <AutoScanSong></AutoScanSong>
  </v-app>
</template>

<script lang="ts">
  import Vue from 'vue';
  import VueRouter from 'vue-router';
  import Home from './pages/Home.vue';
  import SongListLocal from './pages/SongListLocal.vue';
  import SongListOnline from './pages/SongListOnline.vue';
  import Playlists from './pages/Playlists.vue';
  import Settings from './pages/Settings.vue';
  import PlaylistEditor from './pages/PlaylistEditor.vue';
  import FAQ from './pages/FAQ.vue';
  import {get} from 'vuex-pathify';
  import store from './store/store';
  import {remote, shell} from 'electron';
  import MenuNavigationItem from './components/MenuNavigationItem.vue';
  import settings from '@/store/settings';
  import AutoScanSong from './components/AutoScanSong.vue';

  Vue.use(VueRouter);

  const router = new VueRouter({
    routes: [
      {
        path: '/',
        name: 'home',
        component: Home,
      },
      {
        path: '/songs/local',
        name: 'song-list-local',
        component: SongListLocal,
        meta: {requireValidSettings: true},
      },
      {
        path: '/songs/online',
        name: 'song-list-online',
        component: SongListOnline,
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
    components: {MenuNavigationItem, AutoScanSong},
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
          path: '/songs',
          name: 'Song list',
          icon: 'queue_music',
          requireValidConfig: true,
          items: [
            {
              path: '/songs/online',
              name: 'Online',
              icon: 'language',
              requireValidConfig: true,
            },
            {
              path: '/songs/local',
              name: 'Local',
              icon: 'computer',
              requireValidConfig: true,
            },
          ],
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
      darkTheme: get('settings/darkTheme'),
      miniVariant: get('settings/miniVariant'),
      permanent: get('settings/permanent'),
    },
    mounted(): void {
      const st = this.$store as unknown as { _vm: { $root: Vue } };
      st._vm.$root.$on('storageReady', () => this.isReady = true);
    },
    watch: {
      darkTheme() {
        this.$vuetify.theme.dark = this.darkTheme;
        console.log(this.$vuetify.theme);
      },
    },
    created() {
      this.$vuetify.theme.dark = this.darkTheme;
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
