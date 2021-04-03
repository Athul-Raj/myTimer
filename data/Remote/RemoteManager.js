import {RemoteTask} from './Model/RemoteModels';

export default class RemoteManager {
  static BASE_URL = 'https://test-323.herokuapp.com/v1/graphql/';
  static TOKEN =
    'Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6Im1xTFFXMDlNTUxRMUNNZGJpV3cwSyJ9.eyJodHRwczovL2hhc3VyYS5pby9qd3QvY2xhaW1zIjp7IngtaGFzdXJhLWRlZmF1bHQtcm9sZSI6InVzZXIiLCJ4LWhhc3VyYS1hbGxvd2VkLXJvbGVzIjpbInVzZXIiXSwieC1oYXN1cmEtdXNlci1pZCI6Imdvb2dsZS1vYXV0aDJ8MTA3NDU1MTUyOTg0ODMzMzExMzM3In0sImdpdmVuX25hbWUiOiJBdGh1bCIsImZhbWlseV9uYW1lIjoiUmFqIiwibmlja25hbWUiOiJhdGh1bHJhajEiLCJuYW1lIjoiQXRodWwgUmFqIiwicGljdHVyZSI6Imh0dHBzOi8vbGgzLmdvb2dsZXVzZXJjb250ZW50LmNvbS9hLS9BT2gxNEdnd2tuQVZ1NUNUT0ZPdGhUTV8ydVgxM2Q0ZEVqcnpoQkVFV3FtTmpRPXM5Ni1jIiwibG9jYWxlIjoiZW4tR0IiLCJ1cGRhdGVkX2F0IjoiMjAyMS0wNC0wM1QwMjozNjoxNS43ODFaIiwiaXNzIjoiaHR0cHM6Ly90ZXN0LTMyMy51cy5hdXRoMC5jb20vIiwic3ViIjoiZ29vZ2xlLW9hdXRoMnwxMDc0NTUxNTI5ODQ4MzMzMTEzMzciLCJhdWQiOiJNclVTM3NZTEpUU1paMzJpUjN4OUhwQWJ3MzlWVVJVaCIsImlhdCI6MTYxNzQxNzM3NiwiZXhwIjoxNjE3NDUzMzc2LCJhdF9oYXNoIjoiNlZXN2JpNDQyaUlBNDM5YVRrNXh5QSIsIm5vbmNlIjoiMVNRbV9KUjNEeXVJY2VKbWFjRjBwTjRVMTd4R3k1Ym8ifQ.lAL8BdcakPAhtpTBIqcPrg23Xf2t0JKRv8T5oO1GoruvOFn6VJeksQYjYzaBuquhbLKamHK01mE-izj0IwJTpaZuDPxo1ahPHGAbcP_LKmYg0FVKxe3jeM6FdA5_k6jpMVoMpMrjBBbp7bJMjfsEb1h7KHbB0E5flCVr5VzwLZyI9AP1N1nocajhDr8vOLDiq3KQGFtuxXlMouCuPfsONvTLMKX1BamYWdmZk1ueBkfZEwOncEoxvxMRgnYvPhp0bKNwxPK4Dk-pPQxMCX3qsuDW4Z4e0nj9j5OFN5l1yXt9VavwX-7VTvtOBiRm1PAwwVQW6ZlXEiw1pyWQaOJEYQ';

  static parseRemoteError(e) {
    //todo
    return e;
  }

  static parseRemoteSuccess(data) {
    //todo
    return data.data || {};
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
        // console.log('Success Remote: ', JSON.stringify(data));
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
      }
    }`;
      const remoteData = await this.globalPOST(query);
      const parsedData = RemoteManager.parseRemoteSuccess(
        JSON.parse(remoteData),
      );
      return parsedData.tasks || [];
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

  async createTag(name: string) {
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

  async updateTag(taskId: number, name: string) {
    try {
      const query = `mutation UpdateTag($name: String, $id: Int!){
        update_tags_by_pk(_set: {name: $name}, pk_columns: {id: $id}){
          id
        }
      }`;
      const remoteData = await this.globalPOST(query, {id: taskId, name});
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
