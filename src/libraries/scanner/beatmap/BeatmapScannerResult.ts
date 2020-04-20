import { BeatmapLocal } from '@/libraries/beatmap/BeatmapLocal';
import { ScannerResultInterface } from '@/libraries/scanner/ScannerInterface';

export default class BeatmapScannerResult implements ScannerResultInterface {
  public newItems: BeatmapLocal[] = [];

  public removedItems: number = 0;

  public keptItems: number = 0;

  public toString(): string {
    const newItemStr: string = this.newItems.length > 0
      ? `${this.newItems.length} beatmap${this.newItems.length > 1 ? 's' : ''} has been added`
      : '';

    const removeItemStr: string = this.removedItems > 0
      ? `${this.removedItems} beatmap${this.removedItems > 1 ? 's' : ''} has been removed`
      : '';

    return [newItemStr, removeItemStr]
      .filter((s: string) => s !== '')
      .join(' and ');
  }

  public anyChange(): boolean {
    return this.newItems.length !== 0 || this.removedItems !== 0;
  }
}
