<template>
  <v-container pa-0 fluid grid-list-lg v-if="!!items">
    <v-row>
      <v-col cols="auto">
        <v-btn-toggle v-model="displayModeSelected" mandatory>
          <v-btn text v-for="mode in displayMode">
            <v-icon>{{mode.icon}}</v-icon>
          </v-btn>
        </v-btn-toggle>
      </v-col>
      <v-col cols="auto">
        <slot name="sortBy"></slot>
      </v-col>
      <v-col>
        <v-text-field v-model="search" label="search" solo append-icon="search"
                      hide-details clearable @clear="updateSearch">
        </v-text-field>
      </v-col>
      <v-col v-if="allowFilter" cols="auto">
        <v-btn icon large class="mt-1" @click.stop="filterDialog = true">
          <v-icon>filter_list</v-icon>
        </v-btn>
      </v-col>
    </v-row>
    <v-dialog v-if="allowFilter" v-model="filterDialog" width="600px">
      <v-card>
        <v-card-title class="title">Filters</v-card-title>
        <v-card-text>
          <slot name="filter"></slot>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click.stop="filterDialog = false">close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-data-iterator :items="items" :custom-filter="filter" :search="search"
                     :items-per-page="itemsPerPage" :footer-props="{ itemsPerPageOptions }"
                     :server-items-length="total" :options.sync="options" :loading="loading"
                     :sort-by="sortBy" :sort-desc="sortDesc" :must-sort="!!sortBy" :custom-sort="customSort">
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
      allowFilter: {type: Boolean, default: false},
      sortBy: {type: String, default: undefined},
      sortDesc: {type: Boolean, default: true},
      customSort: {type: Function, default: undefined},
    },
    data: () => ({
      search: '',
      options: {},
      displayMode: [
        {icon: 'view_module', mode: 'block'},
        {icon: 'view_stream', mode: 'list'},
      ],
      filterDialog: false,
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
        this.updateSearch();
      },
    },
    methods: {
      updateSearch() {
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
