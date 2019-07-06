<!--suppress ALL -->
<template>
  <div v-if="!(item.requireValidConfig && !settings.configValid)">
    <v-list-group v-if="('items' in item) && !(item.requireValidConfig && !settings.configValid)"
                  :prepend-icon="item.icon" :no-action="!settings.miniVariant" :group="item.path">
      <template v-slot:activator>
        <v-list-tile>
          <v-list-tile-title>{{ item.name }}</v-list-tile-title>
        </v-list-tile>
      </template>
      <MenuNavigationItem v-for="entry in item.items" :item="entry" :depth="depth+1"></MenuNavigationItem>
    </v-list-group>

    <v-list-tile :to="item.path" v-else-if="depth === 0 || settings.miniVariant">
      <v-list-tile-action>
        <v-icon>{{ item.icon }}</v-icon>
      </v-list-tile-action>
      <v-list-tile-content>
        <v-list-tile-title>{{ item.name }}</v-list-tile-title>
      </v-list-tile-content>
    </v-list-tile>

    <v-list-tile :to="item.path" v-else-if="depth > 0">
      <v-list-tile-title>{{ item.name }}</v-list-tile-title>
      <v-list-tile-action>
        <v-icon>{{ item.icon }}</v-icon>
      </v-list-tile-action>
    </v-list-tile>
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
  }
</script>

<style scoped>

</style>
