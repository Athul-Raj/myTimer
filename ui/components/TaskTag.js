import React from 'react';
import {
  Button,
  Modal,
  StyleSheet,
  TextInput,
  TouchableHighlight,
  View,
} from 'react-native';

export default class TaskTag extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      text: '',
    };
  }

  onChangeText = (text) => {
    this.setState({
      text,
    });
  };

  render() {
    const {hideSelf, isVisible} = this.props;
    const {tagName} = this.state;
    return (
      <Modal
        animationType={'fade'}
        transparent={false}
        visible={isVisible}
        onRequestClose={() => {}}>
        <View style={styles.modal}>
          <TextInput
            maxLength={50}
            multiline
            numberOfLines={2}
            onChangeText={(text) => this.onChangeText(text)}
            value={tagName}
            style={styles.textInput}
          />
          <View style={styles.separator} />

          <Button
            title="ADD TASK"
            onPress={() => {
              console.warn('TECT', tagName);
            }}
          />
          <TouchableHighlight style={styles.cancelButton}>
            <Button onPress={() => hideSelf()} title={'Cancel'} />
          </TouchableHighlight>
        </View>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  modal: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#d7d7d7',
    height: 300,
    width: '80%',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#fff',
    marginTop: 80,
    marginLeft: 40,
  },
  cancelButton: {
    height: 40,
    width: 160,
    borderRadius: 10,
    backgroundColor: '#d68888',
    alignSelf: 'center',
    margin: 10,
  },
  textInput: {
    height: 45,
    borderWidth: 1,
    width: '90%',
    alignSelf: 'center',
    borderColor: 'black',
  },
});
