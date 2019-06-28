import PathResolver from './PathResolver';
import ScanSong from './ScanSong';

export default function registerIpc() {
  PathResolver.register();
  ScanSong.register();
};
