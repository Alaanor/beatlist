import { DateRange, IsIn, Range } from "@/libraries/common/Range";
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

export function FilterDateRange(value: DateRange | undefined, query: Date) {
  console.log(value, query);
  return true;
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

    // if (queries.length > 0) {
    //   console.log(queries);

    //   return this.beatmapAsTableData.filter((beatmap: any) =>
    //     queryableHeaders.some((header: BeatmapsTableHeader) => {
    //       if (
    //         queries.some((q: string) => header.queryPrefix.indexOf(q) >= 0)
    //       ) {
    //         if (header.globalquery(beatmap, queries)) {
    //           return true;
    //         }
    //       }
    //       return false;
    //     })
    //   );
    // }
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

  // return this.beatmapAsTableData.filter((
  //   map: any // for each beatmap in the list
  // ) =>
  //   this.headers.some((dataType: BeatmapsTableHeader) => {
  //     // for each data type we can query through we test if it matches

  //     const queries = query.split("@");

  //     if (dataType.queryPrefix && dataType.globalquery) {
  //       for (const prefix of dataType.queryPrefix) {
  //         for (const query of queries) {
  //           if (query.startsWith(prefix)) {
  //             console.log(query);
  //             return dataType.globalquery(
  //               map,
  //               query.replace(`${prefix}:`, "")
  //             );
  //           }
  //         }
  //       }
  //     }

  //     return false;
  //   })
  // );
}

export default {
  FilterRange,
  FilterText,
  FilterDateRange,
  FilterDifficulties,
  filter,
};
