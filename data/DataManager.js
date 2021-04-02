import RemoteManager from './Remote/RemoteManager';

export default class DataManager {
  constructor() {
    this.remoteManager = new RemoteManager();
  }

  getTasks(): Promise<
    [
      {
        title: string,
        updated_at: string,
        id: string,
        start_time: string,
        end_time: string,
      },
    ],
  > {
    return this.remoteManager.getTask();
  }
}
