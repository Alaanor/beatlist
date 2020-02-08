import { ScannerResultInterface } from '@/libraries/scanner/ScannerService';
import { PlaylistLocal } from '@/libraries/playlist/PlaylistLocal';

export default class PlaylistScannerResult implements ScannerResultInterface {
  public newItems: PlaylistLocal[] = [];

  public removedItems: number = 0;

  public keptItems: number = 0;

  public toString(): string {
    return ``; // @TODO
  }
}
