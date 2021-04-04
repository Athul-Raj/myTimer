import React from 'react';
import {FlatList, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import TaskTag from '../components/TaskTag';

export default class TaskDetails extends React.Component<> {
  constructor(props) {
    super(props);
    this.parseNavParams(props);
    this.state = {
      isStarted: false,
      isEnded: false,

      showAddTagPopUp: false,
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
    return <Text style={styles.tagText}>{`#${item.name}`}</Text>;
  };

  renderTags() {
    return (
      <>
        <View style={styles.separator} />
        <View style={styles.tagView}>
          {this.tags && this.tags.isEmpty ? (
            <FlatList
              data={this.tags}
              horizontal
              renderItem={this.renderCell}
              keyExtractor={(item) => String(item.id)}
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
        hideSelf={() => {
          this.setState({
            showAddTagPopUp: false,
          });
        }}
      />
    );
  };

  render() {
    const styleForStartButton = StyleSheet.flatten([
      styles.buttonRound,
      {backgroundColor: 'rgb(184,243,112)'},
    ]);
    const {isEnded, isStarted, showAddTagPopUp} = this.state;
    const {navigation} = this.props;
    return (
      <View style={styles.container}>
        <View
          style={{
            margin: 10,
            marginTop: 20,
          }}>
          <Text style={styles.taskName}>{this.taskName}</Text>
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
});
