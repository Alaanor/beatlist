import {BrowserWindow, ipcMain} from 'electron';

export const ON_WINDOW_SHOW = 'on_window_show';
export const ON_AUTO_SCAN_COMPONENT_READY = 'on_auto_scan_component_ready';

export default class AutoScanSong {
    public static register(): void {
        const win = BrowserWindow.getFocusedWindow();

        if (!win) {
            return;
        }

        win.on('focus', () => {
            win.webContents.send(ON_WINDOW_SHOW);
        });

        ipcMain.on(ON_AUTO_SCAN_COMPONENT_READY, () => {
            // Scan on app launched and component ready
            win.webContents.send(ON_WINDOW_SHOW);
        });
    }
}
