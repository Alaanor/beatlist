export enum BeatmapsTableHeadersTemplate {
  Text = "Text",
  Cover = "Cover",
  Difficulties = "Difficulties",
  Playlists = "Playlists",
  StrToDate = "StrToDate",
  TextTooltip = "TextTooltip",
  BeatmapName = "BeatmapName",
  Rating = "Rating",
}

export enum BeatmapsTableFilterType {
  RangeInt = "Range",
  Text = "Text",
  Difficulties = "Difficulties",
  Date = "Date",
}

export interface BeatmapsTableHeader {
  value: string;
  text: string;
  align?: "start" | "center" | "end";
  width?: number;

  sortable?: boolean;
  searchPrefix?: [string];
  requiresPrefix?: boolean;

  sort?: (a: any, b: any) => number;
  globalSearch?: (value: any, query: string) => boolean; // value is the beatmap's value of the data type

  template: BeatmapsTableHeadersTemplate;
  templateItemAccess?: string;
}
