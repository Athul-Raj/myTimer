import {RemoteTask} from './Model/RemoteModels';

export default class RemoteManager {
  static BASE_URL = 'https://test-323.herokuapp.com/v1/graphql/';
  static TOKEN =
    'Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6Im1xTFFXMDlNTUxRMUNNZGJpV3cwSyJ9.eyJodHRwczovL2hhc3VyYS5pby9qd3QvY2xhaW1zIjp7IngtaGFzdXJhLWRlZmF1bHQtcm9sZSI6InVzZXIiLCJ4LWhhc3VyYS1hbGxvd2VkLXJvbGVzIjpbInVzZXIiXSwieC1oYXN1cmEtdXNlci1pZCI6Imdvb2dsZS1vYXV0aDJ8MTA3NDU1MTUyOTg0ODMzMzExMzM3In0sImdpdmVuX25hbWUiOiJBdGh1bCIsImZhbWlseV9uYW1lIjoiUmFqIiwibmlja25hbWUiOiJhdGh1bHJhajEiLCJuYW1lIjoiQXRodWwgUmFqIiwicGljdHVyZSI6Imh0dHBzOi8vbGgzLmdvb2dsZXVzZXJjb250ZW50LmNvbS9hLS9BT2gxNEdnd2tuQVZ1NUNUT0ZPdGhUTV8ydVgxM2Q0ZEVqcnpoQkVFV3FtTmpRPXM5Ni1jIiwibG9jYWxlIjoiZW4tR0IiLCJ1cGRhdGVkX2F0IjoiMjAyMS0wNC0wMlQwNDo1NjozMS40NzFaIiwiaXNzIjoiaHR0cHM6Ly90ZXN0LTMyMy51cy5hdXRoMC5jb20vIiwic3ViIjoiZ29vZ2xlLW9hdXRoMnwxMDc0NTUxNTI5ODQ4MzMzMTEzMzciLCJhdWQiOiJNclVTM3NZTEpUU1paMzJpUjN4OUhwQWJ3MzlWVVJVaCIsImlhdCI6MTYxNzMzOTM5MSwiZXhwIjoxNjE3Mzc1MzkxLCJhdF9oYXNoIjoid1ZLX0RLdUZzYl9EdVFyZ1I0bDF6QSIsIm5vbmNlIjoiZG9OMEkyRUZreUJmaGxZNHdveGo2WllJVUl0MkUwNFkifQ.yNMYMwWsfsqdyN51id4HsogotH4Hnd4Yf6fdBxM-AuHsEpYuKIoRmbSLQeqbEppR46UPX5ZdcYlXcdfj8mcPiSCGl4BEhM1JjwEHsnsnnNHTfUpV93b05WmJFzWwpucFoAC8l5ODH1vQJ3B3TphtJJrlT8RqirRJb5ozaI-fLFbFFcRhMX65YoUoqhWk075yeCN5wLYTg3H_75XoAJoHIxTVyhPnNC249SLGC5skUz5bgnZFmZLBB-0nitMLHnD3NqP_mKQ3icEl8raGn5lNGSXLe2jsrmyjrBrkUpyitapX5OAGJLGq1kjvuFbPF4VaLJ0mIP2GzdsCvF2lqfGB4w';

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
      return RemoteManager.parseRemoteSuccess(
        JSON.parse(remoteData.tasks || []),
      );
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

  async updateTaskName(taskId: number, updateTaskParam: RemoteTask) {
    try {
      const query = `mutation UpdateTask($title: String, $end_time: timestamptz, $start_time: timestamptz, $id: Int!){
        update_tasks_by_pk(_set: {title: $title, end_time: $end_time, start_time: $start_time}, pk_columns: {id: $id}){
          id
        }
      }`;
      const remoteData = await this.globalPOST(
        query,
        Object.assign(updateTaskParam, {id: taskId}),
      );
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
  async getTags(): Promise<{id: string, name: string}> {
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
