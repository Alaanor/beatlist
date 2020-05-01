export interface Range {
  min: number | undefined;
  max: number | undefined;
}

export interface DateRange {
  min: Date | undefined;
  max: Date | undefined;
}

export function IsIn(value: number, range: Range): boolean {
  if (range.min === undefined && range.max === undefined) {
    return true;
  }

  if (range.min === undefined && range.max !== undefined) {
    return value <= range.max;
  }

  if (range.min !== undefined && range.max === undefined) {
    return value >= range.min;
  }

  if (range.min !== undefined && range.max !== undefined) {
    return range.min <= value && range.max >= value;
  }

  return false;
}

export function IsInDate(value: Date, range: DateRange): boolean {
  return IsIn(value.getTime(), {
    min: range.min?.getTime(),
    max: range.max?.getTime(),
  });
}
