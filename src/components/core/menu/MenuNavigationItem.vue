<template>
  <div v-if="configValid">
    <v-list-item
      v-if="menuRight"
      :to="item.path"
      class="px-0 menu-item"
    >
      <v-list-item-content
        v-if="!miniVariant"
        class="px-2"
      >
        <v-list-item-title style="text-align: right;">
          {{ item.name }}
        </v-list-item-title>
      </v-list-item-content>
      <v-list-item-icon
        class="mx-2 my-2"
        style="left: 0;"
        :title="item.name"
      >
        <v-icon>
          {{ item.icon }}
        </v-icon>
      </v-list-item-icon>
    </v-list-item>
    <v-list-item
      v-else
      :to="item.path"
      class="pa-0 menu-item"
    >
      <v-list-item-icon
        class="mx-2 my-2"
        style="left: 0;"
        :title="item.name"
      >
        <v-icon>
          {{ item.icon }}
        </v-icon>
      </v-list-item-icon>
      <v-list-item-content v-if="!miniVariant">
        <v-list-item-title>{{ item.name }}</v-list-item-title>
      </v-list-item-content>
    </v-list-item>
  </div>
</template>

<script>
import { get } from 'vuex-pathify';

export default {
  name: 'MenuNavigationItem',
  props: {
    item: { type: Object, required: true },
  },
  computed: {
    miniVariant: get('settings/miniVariant'),
    menuRight: get('settings/menuRight'),
    configValid: get('settings/configValid'),
  },
};
</script>

<style scoped>

</style>
