import {BrowserWindow} from 'electron';

export const ON_WINDOW_SHOW = 'on_window_show';

export default class AutoScanSong {
    public static register(): void {
        const win = BrowserWindow.getFocusedWindow();

        if (!win) {
            return;
        }

        win.on('focus', () => {
            win.webContents.send(ON_WINDOW_SHOW);
        });
    }
}
