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
      :footer-props="{ itemsPerPageOptions }">
      <template v-slot:default="props">
        <v-row align="center" justify="center">
          <v-col cols="auto" v-for="item in props.items">
            <slot name="item-block" v-if="modeName === 'block'" :item="item"></slot>
            <slot name="item-list" v-if="modeName === 'list'" :item="item"></slot>
          </v-col>
        </v-row>
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
      total: {type: Number, default: 0},
    },
    data: () => ({
      search: '',
      itemsPerPageOptions: [6, 12, 24, 48],
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
    watch: {
      pagination: {
        handler() {
          this.$emit('paginate');
        },
        deep: true,
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
