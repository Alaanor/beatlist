import Registry from "winreg";

// NOTE: This needs to run in administrator mode for the HKLM registry to function.
/*
From developer:

Access to restricted keys
Since Windows Vista access to certain Registry Hives (HKEY_LOCAL_MACHINE or short HKLM for example) is restricted to processes that run in a security elevated context even if the user that starts the process is an admin. You can start a console within that context by right clicking the console shortcut and selecting the item with the shield icon called "Run as administrator" from the context menu.

Under some rare circumstances access to Registry Hives or particular keys may also be blocked by some antivirus programs or the Windows Group Policy Editor (google for gpedit.msc).

You can also use the regedit.exe tool shipped with Windows to check if you actually have access.
*/

export default function regKey(
  path: string,
  key: string,
  hive: string = Registry.HKLM
): Promise<string | undefined> {
  return new Promise((resolve) => {
    const reg = new Registry({ hive, key: path });

    reg.get(key, (err, resp) => {
      if (err || resp === undefined) {
        return resolve(undefined);
      }
      return resolve(resp.value);
    });
  });
}
