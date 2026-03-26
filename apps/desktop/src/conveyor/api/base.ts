import type { ChannelName, ChannelArgs, ChannelReturn } from "../schemas";

export interface ElectronAPI {
  invoke: (channel: string, ...args: unknown[]) => Promise<unknown>;
}

export class ConveyorApi {
  constructor(protected electronAPI: ElectronAPI) {}

  protected invoke<T extends ChannelName>(
    channel: T,
    ...args: ChannelArgs<T> extends Record<string, never> ? [] : [ChannelArgs<T>]
  ): Promise<ChannelReturn<T>> {
    return this.electronAPI.invoke(channel, ...args) as Promise<ChannelReturn<T>>;
  }
}
