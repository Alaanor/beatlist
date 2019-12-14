import PathResolver from './PathResolver.ipc';
import BeatsaverLinkOpener from './BeatsaverLinkOpener';

export default function registerIpc() {
  PathResolver.register();
  BeatsaverLinkOpener.register();
}
