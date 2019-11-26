import Registry from 'winreg';

export default function regKey(path: string, key: string, hive: string = Registry.HKLM): Promise<string | undefined> {
  return new Promise((resolve) => {
    const reg = new Registry({hive, key: path});

    reg.get(key, (err, resp) => {
      if (err || resp === undefined) {
        return resolve(undefined);
      } else {
        return resolve(resp.value);
      }
    });
  });
}
