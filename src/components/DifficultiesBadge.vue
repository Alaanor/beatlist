<template>
  <div>
    <v-chip :color="mapColor(d)" v-for="d in difficulties" small>{{d}}</v-chip>
  </div>
</template>

<script>
  import Vue from 'vue';
  import SongData from '../lib/SongData';

  export default Vue.extend({
    name: 'DifficultiesBadge',
    props: {song: {type: Object, required: true}},
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
        return SongData.GetDifficulties(this.song);
      },
    },
    methods: {
      mapColor(difficulty) {
        return this.map[difficulty];
      },
    },
  });
</script>

<style scoped>

</style>
