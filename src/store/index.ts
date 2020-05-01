import modal, { ModalStoreState } from '@/store/modal';
import settings, { SettingsStoreState } from './settings';
import beatmap, { BeatmapStoreState } from './beatmap';
import playlist, { PlaylistStoreState } from './playlist';
import notification, { NotificationStoreState } from './notification';
import appState, { AppStateStoreState } from './appState';

export interface StoreState {
  settings: SettingsStoreState,
  beatmap: BeatmapStoreState,
  playlist: PlaylistStoreState,
  notification: NotificationStoreState,
  appState: AppStateStoreState,
  modal: ModalStoreState,
}

export default {
  settings,
  beatmap,
  playlist,
  notification,
  appState,
  modal,
};
