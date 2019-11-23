<template>
  <v-container>
    <div class="d-flex flex-row align-center">
      <v-btn icon large class="mr-3" @click="returnBackHistory" exact>
        <v-icon medium large>chevron_left</v-icon>
      </v-btn>
      <p v-if="!!song" class="display-2 ma-0">{{song.metadata.songName}}</p>
    </div>
    <br>
    <v-skeleton-loader :loading="!song" type="image">
      <OnlineSongInfo :song="song" :more-info="false"></OnlineSongInfo>
    </v-skeleton-loader>
  </v-container>
</template>

<script>
  import Vue from 'vue';
  import DiscordRichPresence from '@/lib/ipc/DiscordRichPresence';
  import SongHelper from '@/lib/data/SongHelper';
  import OnlineSongInfo from '@/components/OnlineSongInfo';

  export default Vue.extend({
    name: 'beatmap',
    components: {OnlineSongInfo},
    data: () => ({
      song: undefined,
    }),
    computed: {
      key() {
        return this.$route.params.key;
      },
    },
    watch: {
      '$route.params.key': {
        handler: () => {
          this.updateSong();
        },
        deep: true,
        immediate: true,
      },
    },
    methods: {
      returnBackHistory() {
        window.history.length > 1 ? this.$router.go(-1) : this.$router.push('/');
      },
      updateSong(key) {
        this.song = undefined;
        SongHelper.getSong(key === undefined ? this.key : key)
          .then((s) => this.song = s);
      },
    },
    mounted() {
      this.updateSong();
    },
    beforeRouteEnter: (to, from, next) => {
      DiscordRichPresence.UpdateStatus(`Map details`, `Viewing ${to.params.key}`);
      next();
    },
  });
</script>
