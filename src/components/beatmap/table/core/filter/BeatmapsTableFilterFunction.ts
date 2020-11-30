import { DifficultiesSimple } from "@/libraries/net/beatsaver/BeatsaverBeatmap";
import { BeatmapsTableDataUnit } from "../BeatmapsTableDataUnit";
import { BeatmapsTableHeader } from "../BeatmapsTableHeaders";

// This function recalculates the min/max from the string each iteration. Couldn't be bothered to change.
// Maybe fix in next update.
export function FilterRange(value: number, query: string) {
  let min: number = Number.MIN_SAFE_INTEGER;
  let max: number = Number.MAX_SAFE_INTEGER;
  const split: string[] = query.replace("[.,]", "").split("-");
  if (!value || !query) {
    return false;
  }

  if (split.length === 1) {
    console.log(query, value);
    return value === parseInt(query, 10);
  }
  if (split.length !== 2) {
    return false;
  }

  if (split[0] !== "") {
    min = parseInt(split[0], 10);
  }
  if (split[1] !== "") {
    max = parseInt(split[1], 10);
  }
  console.log(min, max);
  return value >= min && value <= max;
}

export function FilterText(value: string, query: string): boolean {
  return value.toLowerCase().includes(query.toLowerCase());
}

// TODO: Fix. Dates are being treated as a min. Should return maps made between jan 1 2017 to dec 31 2017 for eg '2017'
export function FilterDateRange(value: Date | undefined, query: string) {
  if (!value || !query) {
    return false;
  }

  console.log(new Date().getMonth(), query);

  let year: number | undefined;
  let month: number | undefined;
  let day: number | undefined;

  const split: string[] = query.split(new RegExp("[- ]"));

  split.forEach((s: string) => {
    const number = parseInt(s, 10);
    if (s.length === 4) {
      year = number;
    } else if (s.length === 2) {
      if (!month && number <= 12) {
        month = number;
      } else if (day && number <= 31) {
        day = number;
      }
    }
  });

  if (year && value.getFullYear() !== year) {
    return false;
  }

  if (month && value.getMonth() !== month) {
    return false;
  }

  if (day && value.getDay() !== day) {
    return false;
  }
  console.log(split);
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
            console.log(beatmap);
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
