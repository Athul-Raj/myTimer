import React from 'react';

import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import DataManager from '../../data/DataManager';
import {CreateTask, ErrorAlert, FooterButton} from '../components';

export default class TaskList extends React.Component {
  constructor(props) {
    super(props);
    this.dataManager = new DataManager();
    this.state = {
      showLoader: true,
      showError: false,

      showCreateTaskPopUp: false,
    };
  }

  static renderTableCell({item}) {
    return (
      <View style={styles.item}>
        <Text style={styles.title}>{item.title}</Text>
      </View>
    );
  }

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
        // console.warn('TASKS', taskList);
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
    const {navigation} = this.props;
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
              renderItem={TaskList.renderTableCell}
              keyExtractor={(item) => String(item.id)}
            />
            <View style={styles.footerContainer}>
              <FooterButton
                title="CREATE TASK"
                onPress={() => {
                  this.showCreateTaskPopUp(true);
                }}
              />
              <FooterButton
                title="TAGS"
                onPress={() => {
                  console.warn('Tags');
                }}
              />
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
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  title: {
    fontSize: 32,
  },
  loader: {
    left: 0,
    bottom: 0,
    top: 0,
    position: 'absolute',
    right: 0,
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
});
