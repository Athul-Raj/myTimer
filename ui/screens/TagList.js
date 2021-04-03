import React from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import DataManager from '../../data/DataManager';
import {ErrorAlert} from '../components';

export default class TagList extends React.Component {
  constructor(props) {
    super(props);
    this.dataManager = new DataManager();
    this.state = {
      showLoader: true,
      showError: false,
      tags: [],
    };
  }

  componentDidMount() {
    this.getTags();
  }

  isLoaderVisible = (showLoader) => {
    this.setState({
      showLoader: showLoader,
    });
  };

  getTags = async () => {
    this.isLoaderVisible(true);
    const tags = await this.dataManager.getTags();
    this.setState({
      tags,
    });
    this.isLoaderVisible(false);
  };

  renderTableCell = ({item}) => {
    const taskData: Task = item;
    return (
      <View style={styles.item}>
        <Text style={styles.title}>{taskData.name}</Text>
      </View>
    );
  };

  render() {
    const {showLoader, showError, tags} = this.state;
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
        <FlatList
          data={tags}
          renderItem={this.renderTableCell}
          keyExtractor={(item) => String(item.id)}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: 'red'},
  item: {
    backgroundColor: '#e0d6e2',
    padding: 10,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  title: {
    height: 25,
    fontSize: 15,
    fontWeight: 'bold',
  },
});
