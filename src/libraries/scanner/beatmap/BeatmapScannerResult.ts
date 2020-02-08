import { ScannerResultInterface } from '@/libraries/scanner/ScannerService';
import { BeatmapLocal } from '@/libraries/beatmap/BeatmapLocal';

export default class BeatmapScannerResult implements ScannerResultInterface {
  public newItems: BeatmapLocal[] = [];

  public removedItems: number = 0;

  public keptItems: number = 0;

  public toString(): string {
    const newItemStr: string = this.newItems.length > 0
      ? `${this.newItems.length} beatmap${this.newItems.length > 1 ? 's' : ''} has been added`
      : '';

    const removeItemStr: string = this.removedItems > 0
      ? `${this.newItems.length} beatmap${this.newItems.length > 1 ? 's' : ''} has been removed`
      : '';

    const keptItemStr: string = this.keptItems > 0
      ? `${this.newItems.length} beatmap${this.newItems.length > 1 ? 's' : ''} has been kept`
      : '';

    return [newItemStr, removeItemStr, keptItemStr]
      .filter((s: string) => s !== '')
      .join(' and ');
  }
}
