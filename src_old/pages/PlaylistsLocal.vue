<!--suppress ALL -->
<template>
  <v-container>
    <v-layout row justify-space-between>
      <p class="display-2">Local playlists</p>

      <div class="mr-5">
        <v-tooltip top>
          <template v-slot:activator="{ on }">
            <v-btn icon large @click="OpenFolder()" :loading="loadingAdd" v-on="on">
              <v-icon>folder</v-icon>
            </v-btn>
          </template>
          <span>Open folder in file explorer</span>
        </v-tooltip>
        <v-tooltip top>
          <template v-slot:activator="{ on }">
            <v-btn icon large color="success" @click="NewPlaylist()" :loading="loadingAdd" v-on="on">
              <v-icon large>add</v-icon>
            </v-btn>
          </template>
          <span>Add a new playlist</span>
        </v-tooltip>
      </div>
    </v-layout>
    <ListViewerForPlaylists :action="GoToPlaylist">
      <template #item-block-action="{item}">
        <v-btn icon exact :to="`/playlist/local/edit/${item.playlistHash}`">
          <v-icon>chevron_right</v-icon>
        </v-btn>
      </template>
      <template #item-list-action="{item}">
        <v-btn icon exact :to="`/playlist/local/edit/${item.playlistHash}`">
          <v-icon>chevron_right</v-icon>
        </v-btn>
      </template>
    </ListViewerForPlaylists>
  </v-container>
</template>

<script>
  import Vue from 'vue';
  import {get} from 'vuex-pathify';
  import {shell} from 'electron';
  import store from '@/store/store';
  import BeatSaber from '@/lib/BeatSaber';
  import ListViewerForPlaylists from '@/components/ListViewerForPlaylists.vue';
  import DiscordRichPresence from '@/lib/ipc/DiscordRichPresence';

  export default Vue.extend({
    name: 'Playlists',
    components: {ListViewerForPlaylists},
    data: () => ({
      rowsPerPageItems: [6, 12, 24, 48],
      pagination: {
        rowsPerPage: 6,
      },
      loadingAdd: false,
    }),
    computed: {
      installationPath: get('settings/installationPath'),
      playlists: get('songs/playlists'),
    },
    async mounted() {
      await store.dispatch('songs/loadPlaylists');
      this.InitiateRichPresence();
    },
    methods: {
      async NewPlaylist() {
        this.loadingAdd = true;
        const playlist = await new BeatSaber(this.installationPath)
          .CreateNewPlaylistFile();
        await store.dispatch('songs/loadPlaylists');
        this.GoToPlaylist(playlist);
      },
      OpenFolder() {
        shell.openItem(BeatSaber.getPlaylistPath(this.installationPath));
      },
      GoToPlaylist(playlist) {
        this.$router.push({name: 'playlist-editor', params: {hash: playlist.playlistHash}});
      },
      InitiateRichPresence() {
        const amount = this.playlists.length;
        const plural = amount > 1 ? 's' : '';
        DiscordRichPresence.UpdateStatus(`Browsing playlist${plural}`, `${amount} local playlist${plural}`);
      },
    },
  });
</script>
