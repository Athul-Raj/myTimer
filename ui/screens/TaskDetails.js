import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';

export default class TaskDetails extends React.Component {
  constructor(props) {
    super(props);
    TaskDetails.parseNavParams(props);
  }

  static parseNavParams(props) {
    // this.onStartClick = props.para
    // this.onStopClick
  }

  render() {
    const styleForStartButton = StyleSheet.flatten([
      styles.buttonRound,
      {backgroundColor: 'rgb(184,243,112)'},
    ]);
    const {onStartClick, onStopClick} = this.props;
    return (
      <View style={styles.container}>
        <View style={styles.buttonView}>
          <TouchableOpacity style={styleForStartButton} onPress={onStartClick}>
            <Text style={{fontSize: 20}}>START</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.buttonRound}>
            <Text style={{fontSize: 20}} onPress={onStopClick}>
              STOP
            </Text>
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
});
