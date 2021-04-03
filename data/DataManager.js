import RemoteManager from './Remote/RemoteManager';
import {TaskParser} from './Remote/Parser';

export default class DataManager {
  constructor() {
    this.remoteManager = new RemoteManager();

    this.taskParser = new TaskParser();
  }

  async getTasks(): Promise<
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
    const data = await this.remoteManager.getTask();
    return this.taskParser.fromRemote(data);
  }

  createTasks(name: string) {
    const obj = {
      title: name,
    };
    return this.remoteManager.createTask(obj);
  }

  startTask(taskId: string) {
    return this.remoteManager.updateTask(taskId, {
      start_time: new Date(Date.now()).toUTCString(),
    });
  }

  endTask(taskId: string) {
    return this.remoteManager.updateTask(taskId, {
      end_time: new Date(Date.now()).toUTCString(),
    });
  }
}
