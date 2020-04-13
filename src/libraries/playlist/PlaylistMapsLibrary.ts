import PlaylistLibrary from '@/libraries/playlist/PlaylistLibrary';
import { PlaylistLocal, PlaylistLocalMap, PlaylistValidMap } from '@/libraries/playlist/PlaylistLocal';
import { BeatmapsTableDataUnit } from '@/components/beatmap/table/core/BeatmapsTableDataUnit';
import BeatsaverCachedLibrary from '@/libraries/beatmap/repo/BeatsaverCachedLibrary';

export default class PlaylistMapsLibrary {
  public static GetAllInvalidMap(): { playlist: PlaylistLocal, invalids: PlaylistLocalMap[] }[] {
    return PlaylistLibrary.GetAllPlaylists().map((playlist) => ({
      playlist,
      invalids: this.GetAllInvalidMapFor(playlist),
    }));
  }

  public static GetAllInvalidMapFlatten(): { playlist: PlaylistLocal, map: PlaylistLocalMap }[] {
    return this.GetAllInvalidMap()
      .reduce((previous: any[], current) => previous.concat(
        ...current.invalids.map((invalid) => ({
          playlist: current.playlist,
          map: invalid,
        })),
      ), []);
  }

  public static GetAllInvalidMapFor(playlist: PlaylistLocal): PlaylistLocalMap[] {
    return playlist.maps.filter((map) => map.error !== null);
  }

  public static GetAllValidMapFor(playlist: PlaylistLocal): PlaylistValidMap[] {
    return playlist.maps
      .filter((map) => map.error === null && map.hash !== undefined) as PlaylistValidMap[];
  }

  public static GetAllValidMapAsTableDataFor(playlist: PlaylistLocal): BeatmapsTableDataUnit[] {
    return this.GetAllValidMapFor(playlist)
      .map((playlistMap: PlaylistValidMap) => ({
        data: BeatsaverCachedLibrary.getByHash(playlistMap.hash)?.beatmap,
      }))
      .filter((unit) => unit.data !== undefined) as BeatmapsTableDataUnit[];
  }
}
