<template>
  <div>
    <span class="headline">
      Details
    </span>
    <v-container>
      <v-row align="center">
        <v-col cols="auto">
          <v-hover>
            <v-sheet
              slot-scope="{hover}"
              elevation="5"
              height="192"
              width="192"
              class="mr-5"
            >
              <v-img
                v-if="imageData.length > 0"
                ref="cover"
                :src="imageData"
                aspect-ratio="1"
              >
                <v-expand-transition>
                  <div
                    v-if="hover"
                    class="d-flex transition-fast-in-fast-out black v-card--reveal"
                  >
                    <v-container>
                      <v-row
                        align="center"
                        justify="center"
                      >
                        <v-btn
                          icon
                          large
                          @click="openFileExplorer()"
                        >
                          <v-icon large>
                            photo
                          </v-icon>
                        </v-btn>
                      </v-row>
                    </v-container>
                  </div>
                </v-expand-transition>
              </v-img>
            </v-sheet>
          </v-hover>
        </v-col>
        <v-col>
          <v-text-field
            ref="title"
            v-model="playlistTitle"
            class="my-5"
            color="secondary"
            label="Title"
            outlined
            hide-details
            clearable
          />
          <v-text-field
            ref="author"
            v-model="playlistAuthor"
            class="my-5"
            color="secondary"
            label="Author"
            outlined
            hide-details
            clearable
          />
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-textarea
            ref="description"
            v-model="playlistDescription"
            label="Description"
            color="secondary"
            hide-details
            outlined
          />
        </v-col>
      </v-row>
    </v-container>
    <v-container>
      <v-card-actions>
        <v-spacer/>
        <v-btn
          text
          color="error"
          :loading="loading"
          @click="confirmDeleteDialog = true"
        >
          Delete
        </v-btn>
        <v-btn
          text
          color="grey"
          :disabled="!IsThereChange()"
          :loading="loading"
          @click="Cancel"
        >
          Cancel
        </v-btn>
        <v-btn
          text
          color="success"
          :disabled="!IsThereChange()"
          :loading="loading"
          @click="Save"
        >
          Save
        </v-btn>
      </v-card-actions>
    </v-container>
    <ConfirmDialog
      :open.sync="confirmDeleteDialog"
      action-text="Delete"
      action-color="error"
      :on-action="Delete"
    >
      <span>
        Are you sure you want to <strong class="error--text">delete</strong> this playlist ?
      </span>
    </ConfirmDialog>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import { remote } from 'electron';
import NotificationService, {
  NOTIFICATION_ICON_DELETE,
  NOTIFICATION_ICON_FAILED,
} from '@/libraries/notification/NotificationService';
import { PlaylistLocal } from '@/libraries/playlist/PlaylistLocal';
import Base64SrcLoader from '@/libraries/os/utils/Base64SrcLoader';
import ConfirmDialog from '@/components/dialogs/ConfirmDialog.vue';
import PlaylistOperation from '@/libraries/playlist/PlaylistOperation';

export default Vue.extend({
  name: 'PlaylistEditorDetails',
  components: { ConfirmDialog },
  props: {
    playlist: { type: Object as PropType<PlaylistLocal>, required: true },
  },
  data: () => ({
    playlistTitle: '',
    playlistAuthor: '',
    playlistDescription: '',
    imageData: '',
    imageChanged: false,
    loading: false,
    confirmDeleteDialog: false,
  }),
  mounted(): void {
    this.LoadCover();
    this.playlistTitle = this.playlist.title;
    this.playlistAuthor = this.playlist.author;
    this.playlistDescription = this.playlist.description ?? '';
  },
  methods: {
    async LoadCover() {
      this.imageChanged = false;

      if (this.playlist.cover) {
        this.imageData = Base64SrcLoader.FromBuffer(this.playlist.cover, 'png');
      } else {
        this.imageData = '';
      }
    },
    Save() {
      this.loading = true;

      const playlist = { ...this.playlist };
      playlist.title = this.playlistTitle;
      playlist.author = this.playlistAuthor;
      playlist.description = this.playlistDescription;
      playlist.cover = Base64SrcLoader.ToBuffer(this.imageData);

      PlaylistOperation
        .UpdatePlaylist(playlist)
        .then((updatedPlaylist: PlaylistLocal | undefined) => {
          if (
            updatedPlaylist === undefined
            || !(updatedPlaylist.hash && updatedPlaylist.hash !== this.playlist.hash)
          ) {
            return;
          }

          this.$router.push({
            name: 'playlists-local-unit',
            params: { hash: updatedPlaylist.hash },
          });

          this.imageChanged = false;
        })
        .finally(() => {
          this.loading = false;
        });
    },
    Cancel() {
      this.Load();
    },
    Load() {
      this.LoadCover();
      this.playlistTitle = this.playlist.title;
      this.playlistAuthor = this.playlist.author;
      this.playlistDescription = this.playlist.description ?? '';
    },
    Delete() {
      PlaylistOperation.DeletePlaylist(this.playlist).then(() => {
        NotificationService.NotifyMessage(
          'The playlist has been deleted',
          undefined,
          NOTIFICATION_ICON_DELETE,
          2500,
        );
        this.$router.push({ name: 'playlists-local' });
      });
    },
    IsThereChange(): boolean {
      return !(
        this.playlist.title === this.playlistTitle
        && this.playlist.author === this.playlistAuthor
        && this.playlist.description === this.playlistDescription
        && !this.imageChanged
      );
    },
    async openFileExplorer() {
      const file = remote.dialog.showOpenDialog({
        properties: ['openFile'],
        filters: [{
          name: 'Images',
          extensions: ['png', 'jpg'],
        }],
      });
      if (file !== undefined) {
        const imageData = await Base64SrcLoader.FromFile(file[0]);
        if (imageData) {
          this.imageData = imageData;
          this.imageChanged = true;
        } else {
          NotificationService.NotifyMessage(
            "Couldn't read the image",
            'error',
            NOTIFICATION_ICON_FAILED,
            2500,
          );
        }
      }
    },
  },
});
</script>

<style scoped>
  .v-card--reveal {
    align-items: center;
    bottom: 0;
    justify-content: center;
    opacity: .75;
    position: absolute;
    width: 100%;
    height: 100%;
  }
</style>
