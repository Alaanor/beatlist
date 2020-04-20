import DiscordRpc from 'discord-rpc';
import { ipcMain, ipcRenderer } from 'electron';

export const SET_DISCORD_RP_STATUS = 'set_discord_rich_presence_status';
const UPDATE_RICH_PRESENCE_VISIBILITY = 'update_rich_presence_visibility';
const DEFAULT_STATUS = 'just started it';

export default class DiscordRichPresence {
  public static UpdateStatus(context?: string, details?: string) {
    ipcRenderer.send(SET_DISCORD_RP_STATUS, { context, details });
  }

  public static SetVisibility(enabled: boolean) {
    ipcRenderer.send(UPDATE_RICH_PRESENCE_VISIBILITY, enabled);
  }

  private enabled: boolean = false;

  private clientId = '642818043109703702';

  private rpc?: DiscordRpc.Client;

  private startTimestamp = Date.now();

  public Initiate() {
    ipcMain.on(SET_DISCORD_RP_STATUS, (event: any, data: { context: string, details: string }) => {
      if (this.enabled) {
        this.setActivity(data.context, data.details);
      }
    });

    ipcMain.on(UPDATE_RICH_PRESENCE_VISIBILITY, async (event: any, enabled: boolean) => {
      this.enabled = enabled;

      if (this.enabled) {
        await this.ConnectRpc();
        this.setActivity();
      } else if (this.rpc) {
        await this.rpc.destroy();
      }
    });
  }

  private async ConnectRpc() {
    this.rpc = new DiscordRpc.Client({ transport: 'ipc' });

    this.rpc.on('ready', () => {
      this.setActivity(DEFAULT_STATUS);
    });

    await this.rpc
      .login({ clientId: this.clientId })
      .catch(console.error);
  }

  private setActivity(context?: string, details?: string) {
    if (!this.rpc) {
      return;
    }

    this.rpc.setActivity({
      details: context, // first line
      state: details, // second line
      startTimestamp: this.startTimestamp,
      largeImageKey: 'beatlist_icon',
    })
      .catch(console.error);
  }
}
