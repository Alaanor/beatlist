<template>
  <div v-if="!(item.requireValidConfig && !settings.configValid)">
    <v-list-group v-if="('items' in item) && !(item.requireValidConfig && !settings.configValid)"
                  :prepend-icon="item.icon" :no-action="!settings.miniVariant" :group="item.path">
      <template v-slot:activator>
        <v-list>
          <v-list-item-title>{{ item.name }}</v-list-item-title>
        </v-list>
      </template>
      <MenuNavigationItem v-for="entry in item.items" :item="entry" :depth="depth+1"></MenuNavigationItem>
    </v-list-group>

    <v-list-item :to="item.path" v-else-if="depth === 0 || settings.miniVariant">
      <v-list-item-icon>
        <v-icon>{{ item.icon }}</v-icon>
      </v-list-item-icon>
      <v-list-item-content>
        <v-list-item-title>{{ item.name }}</v-list-item-title>
      </v-list-item-content>
    </v-list-item>

    <v-list-item :to="item.path" v-else-if="depth > 0">
      <v-list-item-title>{{ item.name }}</v-list-item-title>
      <v-list-item-icon>
        <v-icon>{{ item.icon }}</v-icon>
      </v-list-item-icon>
    </v-list-item>
  </div>
</template>

<script>
  import {get} from 'vuex-pathify';

  export default {
    name: 'MenuNavigationItem',
    props: {
      item: {type: Object, required: true},
      depth: {type: Number, default: 0},
    },
    computed: {
      settings: get('settings'),
    },
  };
</script>

<style scoped>

</style>
