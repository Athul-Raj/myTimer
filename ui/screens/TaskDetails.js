import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';

export default class TaskDetails extends React.Component<> {
  constructor(props) {
    super(props);
    this.parseNavParams(props);
    this.state = {
      isStarted: false,
      isEnded: false,
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

    this.onStartClick =
      (route.params && route.params.onStartClick) || function () {};
    this.onStopClick =
      (route.params && route.params.onStopClick) || function () {};
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

  render() {
    const styleForStartButton = StyleSheet.flatten([
      styles.buttonRound,
      {backgroundColor: 'rgb(184,243,112)'},
    ]);
    const {isEnded, isStarted} = this.state;
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
        <View style={styles.buttonView}>
          <TouchableOpacity
            opacity={0}
            style={styleForStartButton}
            onPress={() => {
              this.onStartClick(this.taskId);
            }}>
            <Text style={styles.buttonText}>START</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.buttonRound}
            onPress={() => {
              this.onStopClick(this.taskId);
            }}>
            <Text style={styles.buttonText}>STOP</Text>
          </TouchableOpacity>
        </View>
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
});
