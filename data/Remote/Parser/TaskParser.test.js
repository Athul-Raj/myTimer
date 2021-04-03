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
        end_time: 'endtime',
        start_time: 'starttime',
      },
      {
        updated_at: '1245',
        id: 123,
        title: 'sometitleXXX',
        end_time: 'endtimeYYY',
        start_time: 'starttimeZZZ',
      },
    ];
    const aa = taskParser.fromRemote(param);
    expect(aa).toEqual([
      {
        title: 'sometitle',
        start_time: 'starttime',
        end_time: 'endtime',
        id: 234,
      },
      {
        title: 'sometitleXXX',
        start_time: 'starttimeZZZ',
        end_time: 'endtimeYYY',
        id: 123,
      },
    ]);
  });
});
