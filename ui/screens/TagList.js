import React from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import DataManager from '../../data/DataManager';
import {ErrorAlert} from '../components';

type Tag = {
  id: string,
  name: string,
};

type TagListState = {
  showLoader: boolean,
  showError: boolean,
  showEditTagPopUp: boolean,
  tags: [Tag],
};

export default class TagList extends React.Component<undefined, TagListState> {
  constructor(props) {
    super(props);
    this.dataManager = new DataManager();
    this.state = {
      showLoader: true,
      showError: false,
      showEditTagPopUp: false,
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

  isAlertVisible = (showAlert) => {
    this.setState({
      showError: showAlert,
    });
  };

  showEditTagPopUp = (showPopUp) => {
    this.setState({
      showEditTagPopUp: showPopUp,
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

  editTag = async (tagId: number, updatedName: string) => {
    this.isLoaderVisible(true);
    await this.dataManager.updateTagName(tagId, updatedName);
    await this.getTags();
    this.isLoaderVisible(false);
  };

  deleteTag = async (tagId: number) => {
    this.isLoaderVisible(true);
    await this.dataManager.deleteTag(tagId);
    await this.getTags();
    this.isLoaderVisible(false);
  };

  renderTableCell = ({item}) => {
    const tag: Tag = item;
    return (
      <View style={styles.item}>
        <Text style={styles.title}>{tag.name}</Text>
        {/*<TouchableOpacity style={styles.actionButton} onPress={() => {}}>*/}
        {/*  <Text>EDIT</Text>*/}
        {/*</TouchableOpacity>*/}
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => {
            this.deleteTag(tag.id);
          }}>
          <Text>DELETE</Text>
        </TouchableOpacity>
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
          keyExtractor={(item: Tag) => String(item.id)}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {flex: 1},
  item: {
    backgroundColor: '#e0d6e2',
    padding: 10,
    marginVertical: 8,
    marginHorizontal: 16,
    flexDirection: 'row',
  },
  title: {
    width: '65%',
    height: 25,
    fontSize: 15,
    fontWeight: 'bold',
  },
  loader: {
    left: 0,
    bottom: 0,
    top: 0,
    position: 'absolute',
    right: 0,
  },
  actionButton: {
    borderWidth: 1,
    borderColor: 'black',
    padding: 3,
    borderRadius: 3,
  },
});
