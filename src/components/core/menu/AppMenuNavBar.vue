<template>
  <v-navigation-drawer
    :mini-variant="miniVariant"
    mini-variant-width="40"
    mobile-break-point="0"
    width="120"
    color="primary"
    style="overflow: visible;"
    :floating="main"
    :permanent="main"
    :clipped="main"
    :app="main"
  >
    <v-list
      dense
      rounded
      class="pa-0 py-1 menu"
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
      style="right: -20px"
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
        x="0"
        y="0"
        width="10"
        height="10"
        :fill="this.$vuetify.theme.currentTheme.primary"
        mask="url(#curve-mask)"
      />
    </svg>
  </v-navigation-drawer>
</template>

<script lang="ts">
import MenuNavigationItem from '@/components/core/menu/MenuNavigationItem.vue';

export default {
  name: 'AppMenuNavBar',
  components: { MenuNavigationItem },
  props: {
    menus: { type: Array, required: true },
    miniVariant: { type: Boolean, required: true },
    main: { type: Boolean, default: false },
  },
};
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
