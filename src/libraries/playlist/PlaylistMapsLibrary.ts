import PlaylistLibrary from '@/libraries/playlist/PlaylistLibrary';
import { PlaylistLocal, PlaylistLocalMap } from '@/libraries/playlist/PlaylistLocal';

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

  public static GetAllValidMapFor(playlist: PlaylistLocal): PlaylistLocalMap[] {
    return playlist.maps.filter((map) => map.error === null);
  }
}
