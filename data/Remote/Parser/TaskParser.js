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
      tagsName: [string],
    },
  ] {
    return remote.map((item) => {
      return {
        title: item.title,
        start_time:
          (item.start_time &&
            new Date(Date.parse(item.start_time)).toLocaleString()) ||
          null,
        end_time:
          (item.end_time &&
            new Date(Date.parse(item.end_time)).toLocaleString()) ||
          null,
        id: item.id,
        tagsName: (item.tags && item.tags.map((tag) => tag.name)) || [],
      };
    });
  }
}
