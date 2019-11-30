<template>
  <v-navigation-drawer
    v-model="drawer"
    app
    clipped
    floating
    :permanent="permanent"
    mini-variant-width="70"
    :expand-on-hover="miniVariant"
    mobile-break-point="0"
    color="transparent"
  >
    <v-card class="ml-2">
      <v-list dense>
        <MenuNavigationItem
          v-for="menu in menus"
          :key="menu.path"
          :item="menu"
        />
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
</template>

<script>
import Vue from 'vue';
import { shell } from 'electron';
import { get } from 'vuex-pathify';
import MenuNavigationItem from './menu/MenuNavigationItem.vue';

export default Vue.extend({
  name: 'AppMenu',
  components: { MenuNavigationItem },
  data: () => ({
    drawer: null,
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
    miniVariant: get('settings/miniVariant'),
    permanent: get('settings/permanent'),
  },
  methods: {
    openGithubRepo() {
      shell.openExternal('https://github.com/Alaanor/beatlist');
    },
    openDiscordInvitation() {
      shell.openExternal('https://discord.gg/f5AmKSH');
    },
  },
});
</script>

<style scoped>

</style>
