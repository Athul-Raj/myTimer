import {RemoteTask} from './Model/RemoteModels';

export default class RemoteManager {
  static BASE_URL = 'https://test-323.herokuapp.com/v1/graphql/';
  static TOKEN =
    'Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6Im1xTFFXMDlNTUxRMUNNZGJpV3cwSyJ9.eyJodHRwczovL2hhc3VyYS5pby9qd3QvY2xhaW1zIjp7IngtaGFzdXJhLWRlZmF1bHQtcm9sZSI6InVzZXIiLCJ4LWhhc3VyYS1hbGxvd2VkLXJvbGVzIjpbInVzZXIiXSwieC1oYXN1cmEtdXNlci1pZCI6Imdvb2dsZS1vYXV0aDJ8MTA3NDU1MTUyOTg0ODMzMzExMzM3In0sImdpdmVuX25hbWUiOiJBdGh1bCIsImZhbWlseV9uYW1lIjoiUmFqIiwibmlja25hbWUiOiJhdGh1bHJhajEiLCJuYW1lIjoiQXRodWwgUmFqIiwicGljdHVyZSI6Imh0dHBzOi8vbGgzLmdvb2dsZXVzZXJjb250ZW50LmNvbS9hLS9BT2gxNEdnd2tuQVZ1NUNUT0ZPdGhUTV8ydVgxM2Q0ZEVqcnpoQkVFV3FtTmpRPXM5Ni1jIiwibG9jYWxlIjoiZW4tR0IiLCJ1cGRhdGVkX2F0IjoiMjAyMS0wNC0wNFQxOTozMjoyOS4yMjVaIiwiaXNzIjoiaHR0cHM6Ly90ZXN0LTMyMy51cy5hdXRoMC5jb20vIiwic3ViIjoiZ29vZ2xlLW9hdXRoMnwxMDc0NTUxNTI5ODQ4MzMzMTEzMzciLCJhdWQiOiJNclVTM3NZTEpUU1paMzJpUjN4OUhwQWJ3MzlWVVJVaCIsImlhdCI6MTYxNzU2NDc0OSwiZXhwIjoxNjE3NjAwNzQ5LCJhdF9oYXNoIjoia1dwVTB3UFVtX3VIXzBWN0tDV1p2dyIsIm5vbmNlIjoiekdUcGhYN1hjZkduMFZoSzlBazdYUEwwZkRudmNjc1AifQ.zIL4lne5zM63cD8SDpe3QHQTnFLSdYJSqk7dOCC3_uCYcGeBuUUaza4ZWM5glMC2eWd1go_1hiIQLT5cq-eNkmInvEy97mdBA5uFjZ0m-ZHMI7OuhIbaTUAX3bwNaI0SJ9tV8Pjp957ZrWBlocnRwJDLH6J5riJIAn5LIBsuWgEEZ4vOOwsrPpXL3D38ZCEGH_CrbAVPhR7RJw8eJP5EZGXCjZop7deFENuk2YWV1IENbUnF561MsHqxFpE8CoKiQOOS12vi0qYFBclVFp8O4-NZnf79CEQyjCz6gCsZ3lKfPhG0SVP1WycXdSnM1kD4qdW6qYxoT1c8AnHF3USybg';

  static parseRemoteError(e) {
    //todo
    return e;
  }

  static parseRemoteSuccess(data) {
    //todo
    return data.data || null;
  }

  globalPOST(query, variables?) {
    return fetch(RemoteManager.BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: RemoteManager.TOKEN,
      },
      body: JSON.stringify({
        query,
        variables,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log('Success Remote: ', JSON.stringify(data));
        return JSON.stringify(data);
      })
      .catch((err) => {
        console.log('ERR Remote: ', err);
        throw err;
      });
  }

  //region Task

  async getTask(): Promise<
    [
      {
        title: string,
        updated_at: string,
        id: string,
        start_time: string,
        end_time: string,
        tags: [{name: string}],
      },
    ],
  > {
    try {
      const query = `query{
      tasks {
        title
        updated_at
        id
        start_time
        end_time
        tags {
          name
        }
      }
    }`;
      const remoteData = await this.globalPOST(query);
      const parsedData = RemoteManager.parseRemoteSuccess(
        JSON.parse(remoteData),
      );
      return (parsedData && parsedData.tasks) || [];
    } catch (e) {
      throw RemoteManager.parseRemoteError(e);
    }
  }

  async createTask(createTaskParam: RemoteTask) {
    try {
      const query = `mutation InsertTasks($title: String, $end_time: timestamptz, $start_time: timestamptz){
        insert_tasks_one(object: {title: $title, end_time: $end_time, start_time: $start_time}){
          id
        }
      }`;
      const remoteData = await this.globalPOST(query, createTaskParam);
      return RemoteManager.parseRemoteSuccess(JSON.parse(remoteData));
    } catch (e) {
      throw RemoteManager.parseRemoteError(e);
    }
  }

  async updateTaskTitle(taskId: number, title: string) {
    try {
      const query = `mutation UpdateTask($title: String, $id: Int!){
        update_tasks_by_pk(_set: {title: $title}, pk_columns: {id: $id}){
          id
        }
      }`;
      const remoteData = await this.globalPOST(query, {
        id: taskId,
        title: title,
      });
      return RemoteManager.parseRemoteSuccess(JSON.parse(remoteData));
    } catch (e) {
      throw RemoteManager.parseRemoteError(e);
    }
  }

  async updateTaskStartTime(taskId: number, startTime: string) {
    try {
      const query = `mutation UpdateTask($start_time: timestamptz, $id: Int!){
        update_tasks_by_pk(_set: {start_time: $start_time}, pk_columns: {id: $id}){
          id
        }
      }`;
      const remoteData = await this.globalPOST(query, {
        id: taskId,
        start_time: startTime,
      });
      return RemoteManager.parseRemoteSuccess(JSON.parse(remoteData));
    } catch (e) {
      throw RemoteManager.parseRemoteError(e);
    }
  }

  async updateTaskEndTime(taskId: number, endTime: string) {
    try {
      const query = `mutation UpdateTask($end_time: timestamptz, $id: Int!){
        update_tasks_by_pk(_set: {end_time: $end_time}, pk_columns: {id: $id}){
          id
        }
      }`;
      const remoteData = await this.globalPOST(query, {
        id: taskId,
        end_time: endTime,
      });
      return RemoteManager.parseRemoteSuccess(JSON.parse(remoteData));
    } catch (e) {
      throw RemoteManager.parseRemoteError(e);
    }
  }

  async deleteTask(taskId: number) {
    try {
      const query = `mutation DeleteTask($id: Int!){
        delete_tasks_by_pk(id: $id){
        id
        }
      }`;
      const remoteData = await this.globalPOST(
        query,
        Object.assign({id: taskId}),
      );
      return RemoteManager.parseRemoteSuccess(JSON.parse(remoteData));
    } catch (e) {
      throw RemoteManager.parseRemoteError(e);
    }
  }

  async deleteTaskTag(taskId: number, tagId: number) {
    try {
      const query = `mutation DeleteTaskTag($tag_id: Int!, $task_id: Int!){
        delete_task_tag_by_pk(tag_id: $tag_id, task_id: $task_id){
        task_id
        tag_id
        }
      }`;
      const remoteData = await this.globalPOST(query, {
        task_id: taskId,
        tag_id: tagId,
      });
      return RemoteManager.parseRemoteSuccess(JSON.parse(remoteData));
    } catch (e) {
      throw RemoteManager.parseRemoteError(e);
    }
  }

  async updateTaskTag(taskId: number, tagId: number) {
    try {
      const query = `mutation UpdateTaskTag($tag_id: Int!, $task_id: Int!){
        insert_task_tag_one(object:{tag_id: $tag_id, task_id: $task_id}){
        task_id
        tag_id 
        }
      }`;
      const remoteData = await this.globalPOST(query, {
        task_id: taskId,
        tag_id: tagId,
      });
      return RemoteManager.parseRemoteSuccess(JSON.parse(remoteData));
    } catch (e) {
      throw RemoteManager.parseRemoteError(e);
    }
  }

  async getTagsOfTask(taskId): Promise<{task_tag: [{tag_id: string}]}> {
    try {
      const query = `query{
        task_tag(where: {task_id: {_eq : ${taskId}}}){
          tag_id
        }
      }`;
      const remoteData = await this.globalPOST(query);
      return RemoteManager.parseRemoteSuccess(JSON.parse(remoteData));
    } catch (e) {
      throw RemoteManager.parseRemoteError(e);
    }
  }

  // endregion

  //region Tag
  async getTags(): Promise<[{id: string, name: string}]> {
    try {
      const query = `query{
      tags {
        name
        id
      }
    }`;
      const remoteData = await this.globalPOST(query);
      return RemoteManager.parseRemoteSuccess(JSON.parse(remoteData));
    } catch (e) {
      throw RemoteManager.parseRemoteError(e);
    }
  }

  async createTag(name: string): Promise<{insert_tags_one: {id: number}}> {
    try {
      const query = `mutation InsertTag($name: String){
        insert_tags_one(object: {name: $name}){
          id
        }
      }`;
      const remoteData = await this.globalPOST(query, {name});
      return RemoteManager.parseRemoteSuccess(JSON.parse(remoteData));
    } catch (e) {
      throw RemoteManager.parseRemoteError(e);
    }
  }

  async updateTag(param: {id: number, name: string}) {
    try {
      const query = `mutation UpdateTag($name: String, $id: Int!){
        update_tags_by_pk(_set: {name: $name}, pk_columns: {id: $id}){
          id
        }
      }`;
      const remoteData = await this.globalPOST(query, param);
      return RemoteManager.parseRemoteSuccess(JSON.parse(remoteData));
    } catch (e) {
      throw RemoteManager.parseRemoteError(e);
    }
  }

  async deleteTag(taskId: number) {
    try {
      const query = `mutation DeleteTag($id: Int!){
        delete_tags_by_pk(id: $id){
        id
        }
      }`;
      const remoteData = await this.globalPOST(
        query,
        Object.assign({id: taskId}),
      );
      return RemoteManager.parseRemoteSuccess(JSON.parse(remoteData));
    } catch (e) {
      throw RemoteManager.parseRemoteError(e);
    }
  }

  //endregion
}
