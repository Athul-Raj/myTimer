import React from 'react';
import {
  Button,
  StyleSheet,
  TextInput,
  TouchableHighlight,
  View,
} from 'react-native';

export default function CreateTask({onDoneClick = () => {}}) {
  const [name, onChangeText] = React.useState(null);
  return (
    <View style={styles.container}>
      <TextInput
        maxLength={50}
        multiline
        numberOfLines={4}
        onChangeText={(text) => onChangeText(text)}
        value={name}
        style={styles.textInput}
      />
      <View style={styles.separator} />
      <Button
        title="Create Task"
        onPress={() => {
          onDoneClick(name);
        }}
      />
      <TouchableHighlight style={styles.cancelButton}>
        <Button onPress={() => onDoneClick(null)} title={'Cancel'} />
      </TouchableHighlight>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#d7d2d7',
    width: '90%',
    height: '90%',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  textInput: {
    height: 45,
    borderWidth: 1,
    width: '90%',
    alignSelf: 'center',
  },
  separator: {
    marginVertical: 15,
    borderBottomColor: '#d7d2d7',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  cancelButton: {
    height: 40,
    width: 160,
    borderRadius: 10,
    backgroundColor: '#d68888',
    alignSelf: 'center',
    margin: 10,
  },
});
