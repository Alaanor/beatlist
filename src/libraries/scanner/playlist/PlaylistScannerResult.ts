import { ScannerResultInterface } from '@/libraries/scanner/ScannerService';
import { PlaylistLocal } from '@/libraries/playlist/PlaylistLocal';

export default class PlaylistScannerResult implements ScannerResultInterface {
  public newItems: PlaylistLocal[] = [];

  public removedItems: number = 0;

  public keptItems: number = 0;

  public updatedItems: number = 0;

  public toString(): string {
    const newItemsStr = this.newItems.length > 0
      ? `${this.newItems.length} playlist${this.newItems.length > 1 ? 's' : ''} has been added`
      : '';

    const removedItemsStr = this.removedItems > 0
      ? `${this.removedItems} playlist${this.removedItems > 1 ? 's' : ''} has been removed`
      : '';

    const keptItemsStr = this.keptItems > 0
      ? `${this.keptItems} playlist${this.keptItems > 1 ? 's' : ''} has been kept`
      : '';

    const updatedItemsStr = this.updatedItems > 0
      ? `${this.updatedItems} playlist${this.updatedItems > 1 ? 's' : ''} has been update`
      : '';

    return [newItemsStr, removedItemsStr, keptItemsStr, updatedItemsStr]
      .filter((s: string) => s !== '')
      .join(' and ');
  }
}
