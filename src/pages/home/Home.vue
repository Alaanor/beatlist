<template>
  <v-container class="py-0">
    <div class="d-flex align-center flex-column">
      <v-img
        :src="titleImage"
        width="200"
      />
      <div
        class="text-center grey--text caption"
      >
        Current version: {{ currentVersion }}
      </div>
    </div>
    <v-container class="py-0">
      <h1>External links</h1>
      <v-row rows="2">
        <v-col
          cols="3"
          class="pa-0"
        >
          <v-btn
            text
            color="link"
            @click="openDiscordInvitation()"
          >
            <v-icon
              class="mx-2"
            >
              mdi-discord
            </v-icon>
            <span
              v-once
              style="text-decoration: underline;"
            >
              Discord
            </span>
          </v-btn>
          <v-btn
            text
            color="link"
            @click="openGithubRepo()"
          >
            <v-icon
              class="mx-2"
            >
              mdi-github-circle
            </v-icon>
            <span
              v-once
              style="text-decoration: underline;"
            >
              Github
            </span>
          </v-btn>
        </v-col>
      </v-row>
    </v-container>
    <ChangelogDisplayer />
  </v-container>
</template>

<script lang='ts'>
import Vue from 'vue';
import { remote, shell } from 'electron';
import ChangelogDisplayer from '../../components/github/changelog/ChangelogDisplayer.vue';
import DiscordRichPresence from '../../libraries/ipc/DiscordRichPresence';
import { get } from 'vuex-pathify';

const titleWhite = require('assets/title_white.png');
const titleDark = require('assets/title_dark.png');

export default Vue.extend({
  name: 'Home',
  components: { ChangelogDisplayer },
  computed: {
    darkTheme: get<boolean>('settings/darkTheme'),
    titleImage() {
      return this.darkTheme ? titleDark : titleWhite;
    },
    currentVersion() {
      return remote.app.getVersion();
    },
  },
  beforeRouteEnter(to, from, next) {
    DiscordRichPresence.UpdateStatus('Home');
    next();
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
