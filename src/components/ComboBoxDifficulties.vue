<template>
  <v-chip-group column multiple v-model="selected" class="pl-2">
    <v-chip filter outlined v-for="diff in map" :color="diff.color">{{diff.name}}</v-chip>
  </v-chip-group>
</template>

<script>
  import Vue from 'vue';

  export default Vue.extend({
    name: 'ComboBoxDifficulties',
    props: {
      value: {type: Object}
    },
    data: () => ({
      selected: [0, 1, 2, 3, 4],
      map: [
        {value: 'expertPlus', name: 'Expert+', color: 'purple'},
        {value: 'expert', name: 'Expert', color: 'error'},
        {value: 'hard', name: 'Hard', color: 'warning'},
        {value: 'normal', name: 'Normal', color: 'info'},
        {value: 'easy', name: 'Easy', color: 'success'},
      ],
    }),
    watch: {
      selected() {
        let diff = {
          easy: false, normal: false, hard: false,
          expert: false, expertPlus: false,
        };

        this.selected.forEach((i) => diff[this.map[i].value] = true);
        this.$emit('input', diff);
      }
    },
  });
</script>

<style scoped>

</style>
