import {regKey} from '@/lib/pathResolver/registry';
import path from 'path';

export default class PathResolverForOculus {

  public static async findPath() {
    const key = await regKey(
      '\\Software\\WOW6432Node\\Oculus VR, LLC\\Oculus\\Config',
      'InitialAppLibrary',
    );

    if (key === undefined) {
      return undefined;
    }

    return path.join(key, 'Software', 'hyperbolic-magnetism-beat-saber');
  }

}
