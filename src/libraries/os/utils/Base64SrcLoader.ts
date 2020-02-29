import fs from 'fs-extra';
import mime from 'mime-types';

export default class Base64SrcLoader {
  public static Format(base64: string, type: string): string {
    return `data:${type};base64,${base64}`;
  }

  public static async FromFile(filepath: string): Promise<string> {
    const data = (await fs.readFile(filepath)).toString('base64');
    const type = mime.lookup(filepath);

    if (type) {
      return this.Format(data, type);
    }

    return this.Format(data, '');
  }

  public static async FromBuffer(buffer: Buffer, type: string): Promise<string> {
    return this.Format(Buffer.from(buffer).toString('base64'), mime.lookup(type) || '');
  }

  public static GetRawSrc(base64src: string): string {
    return base64src.replace(/^(data:.*;base64,)/, '');
  }
}
