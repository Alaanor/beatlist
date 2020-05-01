import { PlaylistLocal } from "@/libraries/playlist/PlaylistLocal";
import { ScannerResultInterface } from "@/libraries/scanner/ScannerInterface";

export default class PlaylistScannerResult implements ScannerResultInterface {
  public newItems: PlaylistLocal[] = [];

  public removedItems: number = 0;

  public keptItems: number = 0;

  public updatedItems: number = 0;

  public toString(): string {
    const newItemsStr =
      this.newItems.length > 0
        ? `${this.newItems.length} playlist${
            this.newItems.length > 1 ? "s" : ""
          } has been added`
        : "";

    const removedItemsStr =
      this.removedItems > 0
        ? `${this.removedItems} playlist${
            this.removedItems > 1 ? "s" : ""
          } has been removed`
        : "";

    const updatedItemsStr =
      this.updatedItems > 0
        ? `${this.updatedItems} playlist${
            this.updatedItems > 1 ? "s" : ""
          } has been updated`
        : "";

    return [newItemsStr, removedItemsStr, updatedItemsStr]
      .filter((s: string) => s !== "")
      .join(" and ");
  }

  public anyChange(): boolean {
    return (
      this.newItems.length !== 0 ||
      this.removedItems !== 0 ||
      this.updatedItems !== 0
    );
  }
}
