<template>
  <v-navigation-drawer
    app
    clipped
    floating
    :permanent="true"
    :mini-variant="miniVariant"
    :right="menuRight"
    mini-variant-width="40"
    mobile-break-point="0"
    width="120"
    color="primary"
    style="overflow: visible;"
  >
    <v-list
      dense
      rounded
      class="pa-0 menu"
    >
      <MenuNavigationItem
        v-for="menu in menus"
        :key="menu.name"
        :item="menu"
      />
    </v-list>
    <svg
      id="curve"
      viewBox="0 0 20 20"
      :style="menuRight ? 'left: -20px;' : 'right: -20px;'"
    >
      <defs>
        <mask id="curve-mask">
          <rect
            width="100%"
            height="100%"
            fill="white"
          />
          <circle
            cy="10"
            cx="10"
            r="50%"
            fill="black"
          />
        </mask>
      </defs>
      <rect
        :x="menuRight ? 10 : 0"
        y="0"
        width="10"
        height="10"
        :fill="this.$vuetify.theme.currentTheme.primary"
        mask="url(#curve-mask)"
      />
    </svg>
  </v-navigation-drawer>
</template>

<script>
import Vue from 'vue';
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
        path: '/beatmap',
        name: 'Beatmaps',
        icon: 'library_music',
      },
      {
        path: '/playlists',
        name: 'Playlists',
        icon: 'playlist_play',
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
    menuRight: get('settings/menuRight'),
    darkTheme: get('settings/darkTheme'),
  },
});
</script>

<style scoped>
.menu {
  height: 100%;
}

.menu > div:last-child {
  bottom: 0px;
  width: 100%;
  position: absolute;
}

#curve {
  position: absolute;
  top: 0px;
  width: 20px;
  height: 20px;
  z-index: 100;
  overflow: visible;
}
</style>
