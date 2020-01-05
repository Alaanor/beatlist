<template>
  <div v-if="configValid">
    <v-list-item
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
    configValid: get('settings/configValid'),
  },
};
</script>

<style scoped>

</style>
