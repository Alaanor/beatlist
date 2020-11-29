import { DateRange, IsIn, IsInDate, Range } from "@/libraries/common/Range";
import { DifficultiesSimple } from "@/libraries/net/beatsaver/BeatsaverBeatmap";
import { BeatmapsTableDataUnit } from "../BeatmapsTableDataUnit";
import { BeatmapsTableHeader } from "../BeatmapsTableHeaders";

export function FilterRange(value: Range, query: number) {
  console.log(value, query);
  return IsIn(query, value);
}

export function FilterText(value: string, query: string): boolean {
  return value.toLowerCase().includes(query.toLowerCase());
}

// TODO: Fix. Dates are being treated as a min. Should return maps made between jan 1 2017 to dec 31 2017 for eg '2017'
export function FilterDateRange(value: Date | undefined, query: string) {
  if (value) {
    const range: DateRange = { min: new Date(query), max: new Date() };
    return IsInDate(value, range);
  }
  return false;
}

export function FilterDifficulties(
  difficulties: DifficultiesSimple,
  query: string[]
) {
  return query.some((q) => difficulties[q]);
}

export function filter(
  query: string,
  headers: BeatmapsTableHeader[],
  beatmaps: any[]
): { raw: BeatmapsTableDataUnit }[] {
  console.log(query);
  // query is the text in the query box

  // if the query has a specific filter query
  if (query.includes("@")) {
    const queries: string[] = query.split("@").filter((item) => item !== "");

    console.log(queries);

    // Filter headers for ones that have the globalquery parameter
    const queryableHeaders: BeatmapsTableHeader[] = headers.filter(
      (header: BeatmapsTableHeader) =>
        header !== undefined &&
        header.globalSearch !== undefined &&
        header.searchPrefix !== undefined
    );

    const headerPairs: { [prefix: string]: BeatmapsTableHeader } = {};

    queryableHeaders.forEach((header: BeatmapsTableHeader) => {
      if (header && header.searchPrefix) {
        header.searchPrefix.forEach((prefix: string) => {
          headerPairs[prefix] = header;
        });
      }
    });

    const pairs: { header: BeatmapsTableHeader; query: string }[] = queries
      .filter((thisQuery: string) => {
        const split: string[] = thisQuery.split(":") as string[];
        return (
          split.length === 2 && split[0] !== undefined && split[1] !== undefined
        );
      })
      .map((thisQuery: string) => {
        return {
          header: thisQuery.split(":")[0],
          query: thisQuery.split(":")[1],
        };
      })
      .map((pair) => {
        console.log(pair);
        return {
          header: headerPairs[pair.header],
          query: pair.query,
        };
      });
    console.log(pairs);

    console.log(queryableHeaders);

    if (pairs.length <= 0) {
      return beatmaps;
    }

    return beatmaps.filter((beatmap: any[]) => {
      return pairs.some(
        (value: { header: BeatmapsTableHeader; query: string }) => {
          if (value.header && value.header.globalSearch) {
            return value.header.globalSearch(beatmap, value.query);
          }
          return false;
        }
      );
    });
  }

  const queryableHeaders = headers.filter(
    (header) => header.requiresPrefix !== undefined && !header.requiresPrefix
  );

  console.log(queryableHeaders);

  return beatmaps.filter((beatmap) =>
    queryableHeaders.some((header) => {
      if (header.globalSearch) {
        return header.globalSearch(beatmap, query);
      }
      return false;
    })
  );
}

export default {
  FilterRange,
  FilterText,
  FilterDateRange,
  FilterDifficulties,
  filter,
};
