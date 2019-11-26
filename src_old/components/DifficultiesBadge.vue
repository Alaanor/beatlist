<template>
  <div>
    <v-chip :color="mapColor(d)" v-for="d in difficulties" small class="ma-1">{{d}}</v-chip>
  </div>
</template>

<script>
  import Vue from 'vue';
  import SongLoader from '../lib/SongLoader';

  export default Vue.extend({
    name: 'DifficultiesBadge',
    props: {
      song: {type: Object, required: false},
      data: {type: Object, required: false},
    },
    data: () => ({
      map: {
        ExpertPlus: 'purple',
        Expert: 'error',
        Hard: 'warning',
        Normal: 'info',
        Easy: 'success',
      },
    }),
    computed: {
      difficulties() {
        if (!!this.song) {
          return SongLoader.GetDifficulties(this.song);
        } else if (!!this.data) {
          return Object.keys(this.data)
            .filter((key) => this.data[key] === true)
            .map((d) => this.capitalizeFirstLetter(d));
        }
      },
    },
    methods: {
      mapColor(difficulty) {
        return this.map[difficulty];
      },
      capitalizeFirstLetter(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
      },
    },
  })
  ;
</script>

<style scoped>

</style>
