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

  startTask(taskId: number) {
    return this.remoteManager.updateTaskStartTime(
      taskId,
      new Date(Date.now()).toUTCString(),
    );
  }

  endTask(taskId: number) {
    return this.remoteManager.updateTaskEndTime(
      taskId,
      new Date(Date.now()).toUTCString(),
    );
  }

  deleteTask(taskId: number) {
    return this.remoteManager.deleteTask(taskId);
  }

  async getTags(): Promise<[{id: string, name: string}]> {
    const data = await this.remoteManager.getTags();
    return data.tags || [];
  }

  updateTagName(tagId: number, name: string) {
    const param = {
      id: tagId,
      name: name,
    };
    return this.remoteManager.updateTag(param);
  }

  deleteTag(tagId: number) {
    return this.remoteManager.deleteTag(tagId);
  }
}
