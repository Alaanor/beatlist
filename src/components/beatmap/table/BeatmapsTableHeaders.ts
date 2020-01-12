import { sortNumber, sortText, sortDateFromString } from '@/components/beatmap/table/function/BeatmapsTableSortFunctions';
import {
  Range, IsIn, DateRange, IsInDate,
} from '@/libraries/common/Range';
import { DifficultiesSimple } from '@/libraries/net/beatsaver/BeatsaverBeatmap';

enum BeatmapsTableHeadersTemplate {
  Text = 'Text',
  Cover = 'Cover',
  Difficulties = 'Difficulties',
  StrToDate = 'StrToDate',
  TextTooltip = 'TextTooltip',
  BeatmapName = 'BeatmapName',
  Rating = 'Rating',
}

export enum BeatmapsTableFilterType {
  RangeInt = 'Range',
  Text = 'Text',
  Difficulties = 'Difficulties',
  Date = 'Date',
}

export interface BeatmapsTableHeader {
  value: string,
  text: string,
  align?: 'start' | 'center' | 'end',
  width?: number,

  sortable?: boolean,
  filterable?: boolean,

  sort?: (a: any, b: any) => number,
  filter?: (value: any, search: string, item: any) => boolean,
  filterType?: BeatmapsTableFilterType,

  template: BeatmapsTableHeadersTemplate,
  templateItemAccess?: string,
}

const headersFilterValue = {
  name: '',
  artist: '',
  mapper: '',
  dl: {} as Range,
  plays: {} as Range,
  upvotes: {} as Range,
  downvotes: {} as Range,
  rating: {} as Range,
  difficulties: ['easy', 'normal', 'hard', 'expert', 'expertPlus'],
  uploaded: {} as DateRange,
  key: '',
  hash: '',
};

const headers = [
  {
    value: 'cover',
    text: 'Cover',
    template: BeatmapsTableHeadersTemplate.Cover,
    align: 'left',
    sortable: false,
    filterable: false,
    width: 48,
  },
  {
    value: 'name',
    text: 'Song name',
    template: BeatmapsTableHeadersTemplate.BeatmapName,
    align: 'left',
    sortable: true,
    filterable: true,
    filter: (value: string) => value
      .toLowerCase()
      .includes(headersFilterValue.name.toLowerCase()),
    filterType: BeatmapsTableFilterType.Text,
    sort: sortText,
  },
  {
    value: 'artist',
    text: 'Artist',
    template: BeatmapsTableHeadersTemplate.Text,
    templateItemAccess: 'metadata.songAuthorName',
    align: 'left',
    sortable: true,
    filterable: true,
    filter: (value: string) => value
      .toLowerCase()
      .includes(headersFilterValue.artist.toLowerCase()),
    filterType: BeatmapsTableFilterType.Text,
    sort: sortText,
  },
  {
    value: 'mapper',
    text: 'Mapper',
    template: BeatmapsTableHeadersTemplate.Text,
    templateItemAccess: 'metadata.levelAuthorName',
    align: 'left',
    sortable: true,
    filterable: true,
    filter: (value: string) => value
      .toLowerCase()
      .includes(headersFilterValue.mapper.toLowerCase()),
    filterType: BeatmapsTableFilterType.Text,
    sort: sortText,
  },
  {
    value: 'difficulties',
    text: 'Difficulties',
    template: BeatmapsTableHeadersTemplate.Difficulties,
    templateItemAccess: 'metadata.difficulties',
    align: 'left',
    sortable: false,
    filterType: BeatmapsTableFilterType.Difficulties,
    filterable: true,
    filter: (value: DifficultiesSimple) => headersFilterValue.difficulties
      .some((diff: string) => value[diff]),
  },
  {
    value: 'dl',
    text: 'Downloads',
    template: BeatmapsTableHeadersTemplate.Text,
    templateItemAccess: 'stats.downloads',
    align: 'center',
    sortable: true,
    filterable: true,
    filterType: BeatmapsTableFilterType.RangeInt,
    filter: (value: number) => IsIn(value, headersFilterValue.dl),
    sort: sortNumber,
  },
  {
    value: 'plays',
    text: 'Plays',
    template: BeatmapsTableHeadersTemplate.Text,
    templateItemAccess: 'stats.plays',
    align: 'center',
    sortable: true,
    filterable: true,
    filterType: BeatmapsTableFilterType.RangeInt,
    filter: (value: number) => IsIn(value, headersFilterValue.plays),
    sort: sortNumber,
  },
  {
    value: 'upvotes',
    text: 'Up votes',
    template: BeatmapsTableHeadersTemplate.Text,
    templateItemAccess: 'stats.upVotes',
    align: 'center',
    sortable: true,
    filterable: true,
    filterType: BeatmapsTableFilterType.RangeInt,
    filter: (value: number) => IsIn(value, headersFilterValue.upvotes),
    sort: sortNumber,
  },
  {
    value: 'downvotes',
    text: 'Down votes',
    template: BeatmapsTableHeadersTemplate.Text,
    templateItemAccess: 'stats.downVotes',
    align: 'center',
    sortable: true,
    filterable: true,
    filterType: BeatmapsTableFilterType.RangeInt,
    filter: (value: number) => IsIn(value, headersFilterValue.downvotes),
    sort: sortNumber,
  },
  {
    value: 'rating',
    text: 'Rating',
    template: BeatmapsTableHeadersTemplate.Rating,
    templateItemAccess: 'stats.rating',
    align: 'center',
    sortable: true,
    filterable: true,
    filterType: BeatmapsTableFilterType.RangeInt,
    filter: (value: number) => IsIn(value, headersFilterValue.rating),
    sort: sortNumber,
  },
  {
    value: 'uploaded',
    text: 'Uploaded',
    template: BeatmapsTableHeadersTemplate.StrToDate,
    templateItemAccess: 'uploaded',
    align: 'center',
    sortable: true,
    filterable: true,
    filterType: BeatmapsTableFilterType.Date,
    filter: (value: string) => IsInDate(new Date(value), headersFilterValue.uploaded),
    sort: sortDateFromString,
  },
  {
    value: 'key',
    text: 'Key',
    template: BeatmapsTableHeadersTemplate.Text,
    templateItemAccess: 'key',
    align: 'center',
    sortable: false,
    filterable: true,
    filterType: BeatmapsTableFilterType.Text,
    filter: (value: string) => value
      .toLowerCase()
      .includes(headersFilterValue.key.toLowerCase()),
    sort: sortNumber,
  },
  {
    value: 'hash',
    text: 'Hash',
    template: BeatmapsTableHeadersTemplate.Text,
    templateItemAccess: 'hash',
    align: 'center',
    sortable: false,
    filterable: true,
    filterType: BeatmapsTableFilterType.Text,
    filter: (value: string) => value
      .toLowerCase()
      .includes(headersFilterValue.hash.toLowerCase()),
    sort: sortNumber,
  },
] as BeatmapsTableHeader[];

export { headers, headersFilterValue };
