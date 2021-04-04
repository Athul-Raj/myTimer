import RemoteManager from './remote/RemoteManager';
import DataManager from './DataManager';

jest.mock('./remote/RemoteManager');
describe('Test: DataManager', () => {
  beforeEach(() => {
    RemoteManager.mockClear();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  function stubRemoteManagerGetTagsOfTask(
    remoteManager: RemoteManager,
    result: {task_tag: [{tag_id: string}]},
  ): void {
    remoteManager.getTagsOfTask = jest.fn().mockImplementation(async () => {
      return Promise.resolve(result);
    });
  }

  test('getTagsOfTicket Parsing', async () => {
    this.dataManager = new DataManager();
    stubRemoteManagerGetTagsOfTask(this.dataManager.remoteManager, {
      task_tag: [{tag_id: 123}, {tag_id: 456}],
    });
    const actualResult = await this.dataManager.getTagsOfTicket(1111);
    expect(actualResult).toEqual([123, 456]);
  });
});
