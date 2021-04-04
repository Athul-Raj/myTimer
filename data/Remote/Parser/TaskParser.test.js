import {TaskParser} from './TaskParser';

describe('Test: Task Parser', () => {
  // afterEach(() => {
  //   jest.clearAllMocks();
  // });
  test('parse task from remote', () => {
    const taskParser = new TaskParser();
    const param = [
      {
        updated_at: '123',
        id: 234,
        title: 'sometitle',
        end_time: 'Sat, 03 Apr 2021 07:36:24 GMT',
        start_time: null,
      },
      {
        updated_at: '1245',
        id: 123,
        title: 'sometitleXXX',
        end_time: 'Sat, 03 Apr 2021 07:36:24 GMT',
        start_time: null,
        tags: [{name: 'sampleTag'}, {name: 'tag222'}],
      },
    ];
    const aa = taskParser.fromRemote(param);
    expect(aa).toEqual([
      {
        title: 'sometitle',
        start_time: null,
        end_time: '4/3/2021, 1:06:24 PM',
        id: 234,
        tagsName: [],
      },
      {
        title: 'sometitleXXX',
        start_time: null,
        end_time: '4/3/2021, 1:06:24 PM',
        id: 123,
        tagsName: ['sampleTag', 'tag222'],
      },
    ]);
  });
});
