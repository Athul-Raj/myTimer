import type {RemoteTask} from '../Model/RemoteModels';

export class TaskParser {
  fromRemote(
    remote: [RemoteTask],
  ): [
    {
      title: string,
      updated_at: string,
      id: string,
      start_time: string,
      end_time: string,
    },
  ] {
    return remote.map((item) => {
      return {
        title: item.title,
        start_time: item.start_time,
        end_time: item.end_time,
        id: item.id,
      };
    });
  }
}
