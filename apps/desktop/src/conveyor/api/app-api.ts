import { ConveyorApi } from "./base";

export class AppApi extends ConveyorApi {
  version(): Promise<string> {
    return this.invoke("app:version");
  }
}
