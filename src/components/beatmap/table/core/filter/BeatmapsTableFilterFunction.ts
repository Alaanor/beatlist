import { DifficultiesSimple } from "@/libraries/net/beatsaver/BeatsaverBeatmap";
import { DateRange, IsIn, IsInDate, Range } from "@/libraries/common/Range";

export function FilterRange(value: number, search: Range) {
  return IsIn(value, search);
}

export function FilterText(value: string, search: string) {
  return value.toLowerCase().includes(search.toLowerCase());
}

export function FilterDateRange(value: Date, search: DateRange) {
  return IsInDate(value, search);
}

export function FilterDifficulties(
  value: DifficultiesSimple,
  search: string[]
) {
  return search.some((diff: string) => value[diff]);
}

export default {
  FilterRange,
  FilterText,
  FilterDateRange,
  FilterDifficulties,
};
