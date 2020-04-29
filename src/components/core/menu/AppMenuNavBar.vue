<template>
  <v-navigation-drawer
    :mini-variant="true"
    mini-variant-width="44"
    mobile-break-point="0"
    width="120"
    color="app"
    style="overflow: visible;"
    :floating="main"
    :permanent="main"
    :clipped="main"
    :app="main"
  >
    <div class="pa-1 fill-height d-flex flex-column">
      <div
        v-for="menu in menus"
        :key="menu.name"
        :class="menu.type === 'spacer' ? 'mt-auto' : ''"
      >
        <MenuNavigationItem
          v-if="menu.type === 'entry'"
          :item="menu"
        />
        <component
          :is="menu.component"
          v-if="menu.type === 'component'"
        />
      </div>
    </div>
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
        :fill="this.$vuetify.theme.currentTheme.app"
        mask="url(#curve-mask)"
      />
    </svg>
  </v-navigation-drawer>
</template>

<script lang="ts">
import MenuNavigationItem from '@/components/core/menu/MenuNavigationItem.vue';
import ScannerStatusOpenButton from '@/components/scanner/ScannerStatusOpenButton.vue';

export default {
  name: 'AppMenuNavBar',
  components: { MenuNavigationItem, ScannerStatusOpenButton },
  props: {
    menus: { type: Array, required: true },
    main: { type: Boolean, default: false },
  },
};
</script>
<style scoped>
  #curve {
    position: absolute;
    top: 0;
    width: 20px;
    height: 20px;
    z-index: 100;
    overflow: visible;
  }
</style>
