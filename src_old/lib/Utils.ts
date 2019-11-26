import fs from 'fs';
import {promisify} from 'util';
import path from 'path';

const readFile = promisify(fs.readFile);

export default class Utils {
  public static async LoadCover(filePath: string): Promise<string> {
    const raw = await readFile(filePath);
    return `data:image/${path.extname(filePath).substring(1)};base64,${raw.toString('base64')}`;
  }
}
