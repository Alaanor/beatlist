import DiscordRpc from 'discord-rpc';
import {ipcMain, ipcRenderer} from 'electron';

export const SET_DISCORD_RP_STATUS = 'set_discord_rich_presence_status';

export default class DiscordRichPresence {

  public static UpdateStatus(context?: string, details?: string) {
    ipcRenderer.send(SET_DISCORD_RP_STATUS, {context, details});
  }

  private clientId = '642818043109703702';
  private rpc = new DiscordRpc.Client({transport: 'ipc'});
  private startTimestamp = Date.now();

  public Initiate() {
    this.rpc.on('ready', () => {
      this.setActivity();
    });

    this.rpc
      .login({clientId: this.clientId})
      .catch(console.error);

    ipcMain.on(SET_DISCORD_RP_STATUS, (event: any, data: {context: string, details: string}) => {
      this.setActivity(data.context, data.details);
    });
  }

  private setActivity(context?: string, details?: string) {
    this.rpc.setActivity({
      details: context, // first line
      state: details, // second line
      startTimestamp: this.startTimestamp,
      largeImageKey: 'beatlist_icon',
    }).catch(console.error);
  }
}
