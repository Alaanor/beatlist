import PathResolver from './PathResolver.ipc';
import BeatsaverLinkOpener from './BeatsaverLinkOpener';
import Base64FileReader from '@/libraries/ipc/Base64FileReader';

export default function registerIpc() {
  PathResolver.register();
  BeatsaverLinkOpener.register();
  Base64FileReader.register();
}
