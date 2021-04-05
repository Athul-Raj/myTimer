import React from 'react';
import {
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import TaskTag from '../components/TaskTag';
import DataManager from '../../data/DataManager';

export default class TaskDetails extends React.Component<> {
  constructor(props) {
    super(props);
    this.parseNavParams(props);
    this.dataManager = new DataManager();
    this.state = {
      isStarted: false,
      isEnded: false,

      showAddTagPopUp: false,
      showEditTaskNamePopUp: false,
      editTaskText: '',
    };
  }

  componentDidMount() {
    this.initialSetup();
  }

  parseNavParams = ({route}) => {
    this.taskId = (route.params && route.params.taskId) || null;
    this.taskName = (route.params && route.params.taskName) || '';
    this.startTime = (route.params && route.params.startTime) || null;
    this.endTime = (route.params && route.params.endTime) || null;

    this.tags = (route.params && route.params.tags) || null;
    this.onStartClick =
      (route.params && route.params.onStartClick) || function () {};
    this.onStopClick =
      (route.params && route.params.onStopClick) || function () {};
    this.deleteTask =
      (route.params && route.params.deleteTask) || function () {};
  };

  refreshTicketDetails = async () => {
    this.tags = await this.dataManager.getTagNameOfTask(this.taskId);
  };

  initialSetup = () => {
    if (this.startTime) {
      this.setState({
        isStarted: true,
      });
    }
    if (this.endTime) {
      this.setState({
        isEnded: true,
      });
    }
  };

  start = () => {
    this.startTime = new Date(Date.now()).toLocaleString();
    this.setState({
      isStarted: true,
    });
  };
  end = () => {
    this.endTime = new Date(Date.now()).toLocaleString();
    this.setState({
      isEnded: true,
    });
  };

  renderCell = ({item}) => {
    return <Text style={styles.tagText}>{`#${item}`}</Text>;
  };

  onChangeText = (text) => {
    this.setState({
      editTaskText: text,
    });
  };

  editTaskName = () => {
    const {editTaskText} = this.state;
    this.dataManager.updateTaskTitle(this.taskId, editTaskText);
    this.taskName = editTaskText;
    this.setState({
      editTaskText: '',
      showEditTaskNamePopUp: false,
    });
  };

  renderEditTagPopUp = (isVisible) => {
    return (
      <Modal animationType="slide" transparent={true} visible={isVisible}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <TextInput
              onChangeText={this.onChangeText}
              style={styles.modalText}
              maxLength={50}
            />
            <TouchableOpacity
              style={styles.buttonDone}
              onPress={() => this.editTaskName()}>
              <Text style={styles.textStyle}>Done</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.buttonCancel}
              onPress={() =>
                this.setState({
                  showEditTaskNamePopUp: false,
                  editTaskText: '',
                })
              }>
              <Text style={styles.textStyle}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  };

  renderTags() {
    return (
      <>
        <View style={styles.separator} />
        <View style={styles.tagView}>
          {this.tags && this.tags.length !== 0 ? (
            <FlatList
              data={this.tags}
              horizontal
              renderItem={this.renderCell}
              keyExtractor={(item) => String(item)}
            />
          ) : (
            <Text style={styles.tagText}> NO TAGS ADDED</Text>
          )}
        </View>
        <TouchableOpacity
          style={styles.tagButtonView}
          onPress={() => {
            this.setState({
              showAddTagPopUp: true,
            });
          }}>
          <Text style={styles.footerButton}>ADD TAG</Text>
        </TouchableOpacity>
        <View style={styles.separator} />
      </>
    );
  }

  renderTaskAddModal = (isVisible) => {
    return (
      <TaskTag
        isVisible={isVisible}
        hideSelf={async () => {
          await this.refreshTicketDetails();
          this.setState({
            showAddTagPopUp: false,
          });
        }}
        taskId={this.taskId}
      />
    );
  };

  render() {
    const styleForStartButton = StyleSheet.flatten([
      styles.buttonRound,
      {backgroundColor: 'rgb(184,243,112)'},
    ]);
    const {
      isEnded,
      isStarted,
      showAddTagPopUp,
      showEditTaskNamePopUp,
    } = this.state;
    const {navigation} = this.props;
    return (
      <View style={styles.container}>
        {this.renderEditTagPopUp(showEditTaskNamePopUp)}
        <View style={styles.detailsView}>
          <View style={styles.titleView}>
            <Text style={styles.taskName}>{this.taskName}</Text>
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => {
                this.setState({
                  showEditTaskNamePopUp: true,
                });
              }}>
              <Text style={styles.editText}>EDIT</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.separator} />
          <Text style={styles.titleName}>
            {isStarted
              ? `Started at: ${this.startTime}`
              : 'Click START to start Task'}
          </Text>
          <Text style={styles.titleName}>
            {isStarted && isEnded
              ? `Completed at: ${this.endTime}`
              : isStarted
              ? 'Click STOP to end Task.'
              : ''}
          </Text>
        </View>
        {this.renderTags()}
        {this.renderTaskAddModal(showAddTagPopUp)}
        <View style={styles.buttonView}>
          <TouchableOpacity
            opacity={0}
            style={styleForStartButton}
            onPress={() => {
              this.onStartClick(this.taskId);
              this.start();
            }}>
            <Text style={styles.buttonText}>START</Text>
          </TouchableOpacity>
          <TouchableOpacity
            disabled={!isStarted}
            style={styles.buttonRound}
            onPress={() => {
              this.onStopClick(this.taskId);
              this.end();
            }}>
            <Text style={styles.buttonText}>STOP</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={styles.footerView}
          onPress={() => {
            this.deleteTask(this.taskId);
            navigation.goBack();
          }}>
          <Text style={styles.footerButton}>DELETE</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  detailsView: {
    margin: 10,
    marginTop: 20,
  },
  buttonView: {
    top: 100,
    justifyContent: 'space-around',
    flexDirection: 'row',
  },
  buttonRound: {
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.2)',
    backgroundColor: 'rgb(236,105,122)',
    alignItems: 'center',
    justifyContent: 'center',
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  titleName: {fontSize: 15, padding: 10, color: '#999999'},
  buttonText: {fontSize: 20},
  taskName: {
    fontSize: 20,
    fontWeight: 'bold',
    padding: 10,
    width: '80%',
  },
  disabledButton: {
    borderColor: '#999999',
    backgroundColor: '#cccccc',
    color: '#666666',
  },
  separator: {
    marginVertical: 15,
    borderBottomColor: '#d7d2d7',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  footerView: {
    position: 'absolute',
    backgroundColor: '#ef8484',
    bottom: 15,
    width: '90%',
    height: 45,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
  },
  footerButton: {
    fontSize: 20,
  },
  tagText: {
    margin: 15,
    alignSelf: 'center',
    color: '#589bdd',
  },
  tagView: {
    height: 50,
    margin: 10,
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 10,
  },
  tagButtonView: {
    marginTop: 8,
    backgroundColor: '#589bdd',
    height: 45,
    width: '90%',
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    width: '75%',
    borderWidth: 1,
    borderColor: 'black',
    textAlign: 'center',
    height: 45,
  },
  buttonDone: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    backgroundColor: '#76c7e3',
  },
  buttonCancel: {
    marginTop: 5,
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    backgroundColor: '#e38888',
  },
  editText: {
    alignSelf: 'center',
    padding: 8,
    borderColor: 'black',
    borderWidth: 1,
  },
  editButton: {
    alignSelf: 'center',
    height: 60,
    width: 60,
    justifyContent: 'center',
  },
  titleView: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
