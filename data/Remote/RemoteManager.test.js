// NOTE: THIS MODULE IS TEST SKIPPED
import RemoteManager from './RemoteManager';

require('isomorphic-fetch');
describe.skip('Test: RemoteManager', () => {
  beforeEach(() => {});

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('getTask', async () => {
    const remoteManager = new RemoteManager();
    await remoteManager.getTask();
  });

  test('createTask', async () => {
    const remoteManager = new RemoteManager();
    await remoteManager.createTask({
      title: 'TESTTing',
      start_time: new Date(Date.now()).toUTCString(),
    });
  });

  test('updateTask', async () => {
    const remoteManager = new RemoteManager();
    await remoteManager.updateTask(1570, {
      title: 'TEST TASK CREATED',
      start_time: new Date(Date.now()).toUTCString(),
    });
  });

  test('deleteTask', async () => {
    const remoteManager = new RemoteManager();
    await remoteManager.deleteTask(1574);
  });

  test('getTags', async () => {
    const remoteManager = new RemoteManager();
    await remoteManager.getTags();
  });

  test('createTags', async () => {
    const remoteManager = new RemoteManager();
    await remoteManager.createTag('TEST TAG');
  });
  test('updateTag', async () => {
    const remoteManager = new RemoteManager();
    await remoteManager.updateTag('1016', 'TEST TAG 01');
  });
  test('deleteTag', async () => {
    const remoteManager = new RemoteManager();
    await remoteManager.deleteTag('1017');
  });
});
