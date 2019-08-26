<template>
  <v-container pa-0 fluid grid-list-lg v-if="!!items">
    <v-layout justify-space-between align-center>
      <v-flex class="mb-4">
        <v-btn-toggle v-model="displayModeSelected" mandatory>
          <v-btn text v-for="mode in displayMode">
            <v-icon>{{mode.icon}}</v-icon>
          </v-btn>
        </v-btn-toggle>
      </v-flex>
      <v-flex>
        <v-text-field v-model="search" label="search" solo append-icon="search"></v-text-field>
      </v-flex>
    </v-layout>
    <v-data-iterator :items="items" :custom-filter="filter" :search="search"
                     :items-per-page="itemsPerPage" :footer-props="{ itemsPerPageOptions }"
                     :server-items-length="total" :options.sync="options" :loading="loading">
      <template v-slot:default="props">
        <v-row v-if="modeName === 'block'" align="center" justify="center">
          <v-col cols="auto" v-for="item in props.items">
            <slot name="item-block" :item="item"></slot>
          </v-col>
        </v-row>
        <v-list v-if="modeName === 'list'" rounded>
          <slot name="item-list" :item="item" v-for="item in props.items"></slot>
        </v-list>
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
      filter: {type: Function, default: undefined},
      total: {type: Number, default: undefined},
      loading: {type: Boolean, default: false},
      itemsPerPage: {type: Number, default: 12},
      itemsPerPageOptions: {type: Array, default: () => [6, 12, 24, 48]},
    },
    data: () => ({
      search: '',
      options: {},
      displayMode: [
        {icon: 'view_module', mode: 'block'},
        {icon: 'view_stream', mode: 'list'},
      ],
    }),
    computed: {
      displayModeSelected: sync('settings/displayMode'),
      modeName() {
        return this.displayMode[this.displayModeSelected].mode;
      },
    },
    watch: {
      options: {
        handler() {
          this.$emit('paginate', this.options);
        },
        deep: true,
      },
      search() {
        this.$emit('updateSearch', this.search);
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
