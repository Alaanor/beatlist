import fs from 'fs-extra';
import mime from 'mime-types';

export default class Base64SrcLoader {
  public static Format(base64: string, type: string): string {
    return `data:${type};base64,${base64}`;
  }

  public static async FromFile(filepath: string): Promise<string> {
    const data = await fs.readFile(filepath);
    const type = mime.lookup(filepath);

    if (type) {
      return this.FromBuffer(data, type);
    }

    return this.FromBuffer(data, '');
  }

  public static FromBuffer(buffer: Buffer, type: string): string {
    return this.Format(Buffer.from(buffer).toString('base64'), mime.lookup(type) || '');
  }

  public static ToBuffer(base64: string): Buffer {
    return Buffer.from(this.GetRawSrc(base64), 'base64');
  }

  public static GetRawSrc(base64src: string): string {
    return base64src.replace(/^(data:.*;base64,)/, '');
  }
}
