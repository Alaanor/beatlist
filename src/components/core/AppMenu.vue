<template>
  <div>
    <!-- 1 column nav bar -->
    <AppMenuNavBar
      v-if="subNav.length === 0"
      :menus="menus"
      :mini-variant="true"
      main
    />

    <!-- 2 column nav bar -->
    <v-navigation-drawer
      v-else
      app
      floating
      clipped
      permanent
      color="appSecondary"
      :mini-variant="true"
      mini-variant-width="88"
    >
      <v-row class="fill-height" no-gutters>
        <AppMenuNavBar :menus="menus" :mini-variant="true" />
        <v-list v-if="subNav.length !== 0" dense rounded class="grow pa-1 py-1">
          <MenuNavigationItem
            v-for="menu in subNav"
            :key="menu.name"
            :item="menu"
          />
        </v-list>
      </v-row>
    </v-navigation-drawer>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { get } from "vuex-pathify";
import MenuNavigationItem from "@/components/core/menu/MenuNavigationItem.vue";
import AppMenuNavBar from "@/components/core/menu/AppMenuNavBar.vue";

export default Vue.extend({
  name: "AppMenu",
  components: { AppMenuNavBar, MenuNavigationItem },
  data: () => ({
    drawer: null,
    menus: [
      {
        type: "entry",
        path: "/",
        name: "Home",
        icon: "home",
      },
      {
        type: "entry",
        path: "/beatmaps",
        name: "Beatmaps",
        icon: "library_music",
      },
      {
        type: "entry",
        path: "/playlists",
        name: "Playlists",
        icon: "playlist_play",
      },
      {
        type: "spacer",
      },
      {
        type: "component",
        component: "ScannerStatusOpenButton",
      },
      {
        type: "component",
        component: "DownloadGoToPageButton",
      },
      {
        type: "entry",
        path: "/settings",
        name: "Settings",
        icon: "settings",
      },
    ],
  }),
  computed: {
    darkTheme: get<boolean>("settings/darkTheme"),
    subNav: get<object[]>("appState/subNav"),
  },
});
</script>

<style scoped>
.menu > div:last-child {
  bottom: 0px;
  width: 100%;
  position: absolute;
}
</style>

<style>
.v-navigation-drawer__border {
  width: 0 !important;
}
</style>
