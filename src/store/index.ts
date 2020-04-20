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
}

export default {
  settings,
  beatmap,
  playlist,
  notification,
  appState,
};
