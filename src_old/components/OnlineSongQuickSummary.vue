<template>
  <span>
    <span class="pl-2">
      <span class="pr-2">{{song.stats.downloads}}</span><v-icon small>file_download</v-icon>
    </span>
    <span class="pl-2">
      <span class="pr-2">{{song.stats.upVotes}}/{{song.stats.downVotes}}</span><v-icon small>thumbs_up_down</v-icon>
    </span>
  </span>
</template>

<script>
  import Vue from 'vue';

  export default Vue.extend({
    name: 'OnlineSongQuickSummary',
    props: {
      song: {type: Object, required: true},
    },
  });
</script>

<style scoped>

</style>
