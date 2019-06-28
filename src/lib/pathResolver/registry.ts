import Registry from 'winreg';

export const regKey: (path: string, key: string, hive?: string) => Promise<string | undefined> =
  (path, key, hive = Registry.HKLM) =>
    new Promise((resolve) => {
      const reg = new Registry({hive, key: path});

      reg.get(key, (err, resp) => {
        if (err) {
          return resolve(undefined);
        }

        if (resp === undefined) {
          return resolve(undefined);
        } else {
          return resolve(resp.value);
        }
      });
    });
