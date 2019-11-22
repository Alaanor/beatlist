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
          <v-list-item @click="openDiscordInvitation()">
            <v-list-item-icon>
              <v-icon>mdi-discord</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>Discord</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-card>

    </v-navigation-drawer>
    <v-app-bar app dense flat clipped-left class="windows-draggable"
               :color="darkTheme ? '#303030' : 'rgba(250, 250, 250, 0)'">
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
    <BackgroundSongDownloadNotifier></BackgroundSongDownloadNotifier>
    <BackgroundPlaylistDownloadNotifier></BackgroundPlaylistDownloadNotifier>
  </v-app>
</template>

<script lang="ts">
  import Vue from 'vue';
  import Home from './pages/Home.vue';
  import Settings from './pages/Settings.vue';
  import {get} from 'vuex-pathify';
  import {ipcRenderer, remote, shell} from 'electron';
  import MenuNavigationItem from './components/MenuNavigationItem.vue';
  import settings from './store/settings';
  import AutoScanSong from './components/AutoScanSong.vue';
  import BackgroundSongDownloadNotifier from './components/BackgroundSongDownloadNotifier.vue';
  import BackgroundPlaylistDownloadNotifier from './components/BackgroundPlaylistDownloadNotifier.vue';
  import router from './plugins/router';
  import DiscordRichPresence from '@/lib/ipc/DiscordRichPresence';
  import {ON_BEATSAVER_LINK_OPENER_COMPONENT_READY, OPEN_BEATSAVER_LINK} from '@/lib/ipc/BeatsaverLinkOpener';

  export default Vue.extend({
    router,
    components: {
      MenuNavigationItem,
      AutoScanSong,
      BackgroundSongDownloadNotifier,
      BackgroundPlaylistDownloadNotifier,
    },
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
          icon: 'library_music',
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
          path: '/playlists',
          name: 'Playlists',
          icon: 'playlist_play',
          requireValidConfig: true,
          items: [
            {
              path: '/playlists/online',
              name: 'Online',
              icon: 'language',
              requireValidConfig: true,
            },
            {
              path: '/playlists/local',
              name: 'Local',
              icon: 'computer',
              requireValidConfig: true,
            },
          ],
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
      configValid: get('settings/configValid'),
      enableDiscordRichPresence: get('settings/enableDiscordRichPresence'),
    },
    mounted(): void {
      const st = this.$store as unknown as { _vm: { $root: Vue } };
      st._vm.$root.$on('storageReady', () => {
        this.isReady = true;
        this.onReady();
      });
    },
    watch: {
      darkTheme() {
        this.$vuetify.theme.dark = this.darkTheme;
      },
    },
    created() {
      this.$vuetify.theme.dark = this.darkTheme;
    },
    methods: {
      onReady() {
        this.CheckForSettingsRequirement();
        this.RegisterBeatsaverLinkListener();
        DiscordRichPresence.SetVisibility(this.enableDiscordRichPresence);
      },
      RegisterBeatsaverLinkListener() {
        ipcRenderer.on(OPEN_BEATSAVER_LINK, (event: any, key: any) => {
          this.$router.push({name: 'beatmap', params: {key: key}});
        });

        ipcRenderer.send(ON_BEATSAVER_LINK_OPENER_COMPONENT_READY);
      },
      CheckForSettingsRequirement() {
        if (!this.configValid) {
          this.$router.push({name: 'settings'});
        }
      },
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
      openDiscordInvitation() {
        shell.openExternal('https://discord.gg/f5AmKSH');
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
