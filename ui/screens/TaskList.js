import React from 'react';

import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import DataManager from '../../data/DataManager';
import {CreateTask, ErrorAlert, FooterButton} from '../components';
import Routes from '../router/Routes';

type Task = {
  title: string,
  updated_at: string,
  id: string,
  start_time: string,
  end_time: string,
  tagsName: [string],
};

type TaskListState = {
  showLoader: boolean,
  showError: boolean,
  showCreateTaskPopUp: boolean,

  taskList: [Task],
};

export default class TaskList extends React.Component<null, TaskListState> {
  constructor(props) {
    super(props);
    this.dataManager = new DataManager();
    this.state = {
      showLoader: true,
      showError: false,

      showCreateTaskPopUp: false,
    };
  }

  renderTableCell = ({item}) => {
    const taskData: Task = item;
    return (
      <TouchableOpacity
        style={styles.item}
        onPress={() => {
          this.navigateToTaskDetail(taskData);
        }}>
        <Text style={styles.title}>{taskData.title}</Text>
        <View style={styles.cellFooter}>
          <Text style={styles.startTime}>
            {taskData.start_time
              ? `START: ${taskData.start_time}`
              : 'YET TO START'}
          </Text>
          <Text style={styles.endTime}>
            {taskData.end_time ? `END: ${taskData.end_time}` : ''}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  navigateToTaskDetail = (taskData: Task) => {
    const {navigation} = this.props;
    navigation.navigate(Routes.TaskDetails, {
      taskId: taskData.id,
      tags: taskData.tagsName,
      taskName: taskData.title,
      startTime: taskData.start_time,
      endTime: taskData.end_time,
      onStartClick: this.startTask,
      onStopClick: this.stopTask,
      deleteTask: this.deleteTask,
    });
  };

  navigateToTags = () => {
    const {navigation} = this.props;
    navigation.navigate(Routes.TagList);
  };

  startTask = async (taskId: number) => {
    this.isLoaderVisible(true);
    await this.dataManager.startTask(taskId);
    await this.getTasks();
    this.isLoaderVisible(false);
  };

  stopTask = async (taskId: number) => {
    this.isLoaderVisible(true);
    await this.dataManager.endTask(taskId);
    await this.getTasks();
    this.isLoaderVisible(false);
  };

  deleteTask = async (taskId: number) => {
    this.isLoaderVisible(true);
    await this.dataManager.deleteTask(taskId);
    await this.getTasks();
    this.isLoaderVisible(false);
  };

  componentDidMount() {
    this.getTasks();
  }

  createTask = async (title: string) => {
    this.showCreateTaskPopUp(false);
    this.isLoaderVisible(true);
    await this.dataManager.createTasks(title);
    await this.getTasks();
    this.isLoaderVisible(false);
  };

  getTasks = () => {
    this.dataManager
      .getTasks()
      .then((taskList) => {
        this.setState({
          taskList,
        });
        this.isLoaderVisible(false);
      })
      .catch(() => {
        this.isLoaderVisible(false);
      });
  };

  isLoaderVisible = (showLoader) => {
    this.setState({
      showLoader: showLoader,
    });
  };

  isAlertVisible = (showAlert) => {
    this.setState({
      showError: showAlert,
    });
  };

  showCreateTaskPopUp = (showPopUp) => {
    this.setState({
      showCreateTaskPopUp: showPopUp,
    });
  };

  render() {
    const {showLoader, showError, taskList, showCreateTaskPopUp} = this.state;

    return (
      <View style={styles.container}>
        {showLoader && (
          <ActivityIndicator style={styles.loader} size="large" color="black" />
        )}
        {showError && (
          <ErrorAlert
            message={'Please retry some error'}
            hideSelf={() => this.isAlertVisible(false)}
          />
        )}
        {showCreateTaskPopUp && (
          <CreateTask
            onDoneClick={(title) => {
              if (title && title.length > 0) {
                this.createTask(title);
              } else {
                this.showCreateTaskPopUp(false);
              }
            }}
            cancelClick={() => {
              this.showCreateTaskPopUp(false);
            }}
          />
        )}
        {!showCreateTaskPopUp && (
          <>
            <FlatList
              data={taskList}
              renderItem={this.renderTableCell}
              keyExtractor={(item) => String(item.id)}
            />
            <View style={styles.footerContainer}>
              <FooterButton
                title="CREATE TASK"
                onPress={() => {
                  this.showCreateTaskPopUp(true);
                }}
              />
              <FooterButton title="TAGS" onPress={this.navigateToTags} />
            </View>
          </>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {flex: 1},
  cityTextInput: {
    padding: 5,
    height: 40,
    width: '50%',
    borderColor: 'gray',
    borderWidth: 1,
  },
  item: {
    backgroundColor: '#e0d6e2',
    padding: 10,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  title: {
    height: 32,
    fontSize: 15,
    fontWeight: 'bold',
  },
  startTime: {
    bottom: 1,
    fontSize: 12,
    color: '#77767a',
  },
  endTime: {
    bottom: 1,
    fontSize: 12,
    color: '#77767a',
  },
  loader: {
    left: 0,
    bottom: 0,
    top: 0,
    position: 'absolute',
    right: 0,
    zIndex: 1,
  },
  footerContainer: {
    marginBottom: 15,
    width: '100%',
    height: 60,
    backgroundColor: '#dd6656',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  cellFooter: {
    height: 20,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
});
