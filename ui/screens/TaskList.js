import React from 'react';

import {
  ActivityIndicator,
  Button,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import DataManager from '../../data/DataManager';
import ErrorAlert from '../components/ErrorAlert';

export default class TaskList extends React.Component {
  constructor(props) {
    super(props);
    this.dataManager = new DataManager();
    this.state = {
      cityName: '',
      lookUpButtonDisabled: true,
      showLoader: false,
      showError: false,
    };
  }
  componentDidMount() {
    // this.dataManager
    //   .getTasks()
    //   .then((taskList) => {
    //     console.warn('TASKS', taskList);
    //   })
    //   .catch(() => {});
  }

  onChangeText = (text) => {
    this.setState({
      cityName: text,
      lookUpButtonDisabled: text.length <= 0,
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

  render() {
    const {navigation} = this.props;
    const {cityName, showLoader, showError, lookUpButtonDisabled} = this.state;

    return (
      <View style={styles.container}>
        {showLoader && <ActivityIndicator size="large" color="black" />}
        {showError && (
          <ErrorAlert
            message={'Please retry some error'}
            hideSelf={() => this.isAlertVisible(false)}
          />
        )}

        <TextInput
          style={styles.cityTextInput}
          onChangeText={(text) => this.onChangeText(text)}
          value={cityName}
          placeholder={'Enter City Name'}
        />
        <Button
          title="Look Up"
          // onPress={() => this.onLookUpClicked(navigation, cityName)
          // }
          disabled={lookUpButtonDisabled}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {flex: 1, alignItems: 'center', justifyContent: 'center'},
  cityTextInput: {
    padding: 5,
    height: 40,
    width: '50%',
    borderColor: 'gray',
    borderWidth: 1,
  },
});
