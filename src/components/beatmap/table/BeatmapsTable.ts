import { headers } from '@/components/beatmap/table/BeatmapsTableHeaders';
import Utilities from '@/libraries/helper/Utilities';

function customSort(
  items: any[],
  sortBy: string[],
  sortDesc: boolean[],
  locale: string,
  customSorters?: Record<string, (a: any, b: any) => number>,
): any[] {
  for (const [index, headerName] of sortBy.entries()) {
    const isDesc = sortDesc[index];
    const sorter = customSorters === undefined ? () => 0 : customSorters[headerName];
    const header = headers.find((h) => h.value === headerName);

    items.sort((a: any, b: any) => {
      if (!header || !header.templateItemAccess) {
        return 0;
      }

      return sorter(
        Utilities.byIndex(a.data, header.templateItemAccess),
        Utilities.byIndex(b.data, header.templateItemAccess),
      );
    });

    if (!isDesc) {
      items = items.reverse();
    }
  }

  return items;
}

export { headers, customSort };
