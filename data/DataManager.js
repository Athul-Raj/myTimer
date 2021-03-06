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
        tagsName: [string],
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

  updateTaskTitle(taskId: number, title: string) {
    return this.remoteManager.updateTaskTitle(taskId, title);
  }

  deleteTask(taskId: number) {
    return this.remoteManager.deleteTask(taskId);
  }

  async getTags(): Promise<[{id: string, name: string}]> {
    const data = await this.remoteManager.getTags();
    return (data && data.tags) || [];
  }

  async createTag(tagName: string): Promise<number | null> {
    const result = await this.remoteManager.createTag(tagName);
    return (
      (result && result.insert_tags_one && result.insert_tags_one.id) || null
    );
  }

  attachTagToTask(tagId: number, taskId: number) {
    return this.remoteManager.updateTaskTag(taskId, tagId);
  }

  removeTagFromTask(tagId: number, taskId: number) {
    return this.remoteManager.deleteTaskTag(taskId, tagId);
  }

  async getTagsOfTicket(taskId: number): Promise<[number]> {
    const result = await this.remoteManager.getTagsOfTask(taskId);
    return (result.task_tag && result.task_tag.map((tag) => tag.tag_id)) || [];
  }

  async getTagNameOfTask(taskId: number): Promise<[string]> {
    const result = await this.remoteManager.getTagNamesOfTask(taskId);
    return (
      (result.task_tag && result.task_tag.map((tag) => tag.tag.name || '')) ||
      []
    );
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
