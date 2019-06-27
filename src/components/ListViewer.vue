<!--suppress ALL -->
<template>
  <v-container pa-0 fluid grid-list-lg v-if="!!items">
    <v-layout justify-space-between align-center>
      <v-flex class="mb-4">
        <v-btn-toggle v-model="displayModeSelected" mandatory>
          <v-btn flat v-for="mode in displayMode">
            <v-icon>{{mode.icon}}</v-icon>
          </v-btn>
        </v-btn-toggle>
      </v-flex>
      <v-flex>
        <v-text-field v-model="search" label="search" solo append-icon="search"></v-text-field>
      </v-flex>
    </v-layout>
    <v-data-iterator
            :items="items"
            :rows-per-page-items="rowsPerPageItems"
            :pagination.sync="pagination"
            :custom-filter="filter"
            :search="search" wrap
            :content-tag="modeName === 'block' ? 'v-layout' : 'v-list'"
            content-class="pa-0 ma-0 justify-center align-center">
      <template #item="props">
        <v-flex v-if="modeName === 'block'" my-3 shrink>
          <slot name="item-block" :item="props.item"></slot>
        </v-flex>
        <v-card v-if="modeName === 'list'">
          <slot name="item-list" :item="props.item"></slot>
        </v-card>
      </template>
    </v-data-iterator>
  </v-container>
</template>

<script>
  import Vue from 'vue';
  import {sync} from 'vuex-pathify';

  export default Vue.extend({
    name: 'ListViewer',
    props: {
      items: {type: Array, required: true},
      filter: {type: Function},
    },
    data: () => ({
      search: '',
      rowsPerPageItems: [6, 12, 24, 48],
      displayMode: [
        {icon: 'view_module', mode: 'block'},
        {icon: 'view_stream', mode: 'list'},
      ],
    }),
    computed: {
      displayModeSelected: sync('settings/displayMode'),
      pagination: sync('settings/pagination'),
      modeName() {
        return this.displayMode[this.displayModeSelected].mode;
      },
    },
    filters: {
      forceInt(value) {
        return Number.parseInt(value, 10).toString();
      },
    },
  });
</script>

<style scoped>

</style>
