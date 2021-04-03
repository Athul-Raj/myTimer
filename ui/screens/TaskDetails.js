import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';

export default class TaskDetails extends React.Component<> {
  constructor(props) {
    super(props);
    this.parseNavParams(props);
  }

  parseNavParams = ({route}) => {
    this.taskId = (route.params && route.params.taskId) || null;
    this.onStartClick =
      (route.params && route.params.onStartClick) || function () {};
    this.onStopClick =
      (route.params && route.params.onStopClick) || function () {};
  };

  render() {
    const styleForStartButton = StyleSheet.flatten([
      styles.buttonRound,
      {backgroundColor: 'rgb(184,243,112)'},
    ]);
    return (
      <View style={styles.container}>
        <View style={styles.buttonView}>
          <TouchableOpacity
            style={styleForStartButton}
            onPress={() => {
              this.onStartClick(this.taskId);
            }}>
            <Text style={styles.titleName}>START</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.buttonRound}
            onPress={() => {
              this.onStopClick(this.taskId);
            }}>
            <Text style={styles.titleName}>STOP</Text>
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
  titleName: {fontSize: 20},
});
