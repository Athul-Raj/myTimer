import React from 'react';
import {
  ActivityIndicator,
  Button,
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableHighlight,
  TouchableOpacity,
  View,
} from 'react-native';
import DataManager from '../../data/DataManager';

type TaskTagProps = {
  isVisible: boolean,
  hideSelf: () => {},
  ticketTags: [
    {
      id: number,
      name: string,
    },
  ],
};

type TaskTagState = {
  searchText: string,
  listData: [
    {
      id: number,
      name: string,
    },
  ],
  taskTagsIds: [string],
  showLoader: boolean,
};

export default class TaskTag extends React.Component<
  TaskTagProps,
  TaskTagState,
> {
  constructor(props) {
    super(props);
    const taskTagsIds =
      (this.props.ticketTags && this.props.ticketTags.map((tag) => tag.id)) ||
      [];
    this.dataManager = new DataManager();
    this.state = {
      searchText: '',
      listData: [],
      taskTagsIds: taskTagsIds,
      showLoader: true,
    };
  }

  componentDidMount() {
    this.getAllTasks();
  }

  getAllTasks = async () => {
    this.isLoaderVisible(true);
    this.allTags = await this.dataManager.getTags();
    this.setState({
      listData: this.allTags,
    });
    this.isLoaderVisible(false);
  };

  isLoaderVisible = (showLoader) => {
    this.setState({
      showLoader: showLoader,
    });
  };

  onChangeText = (updatedText) => {
    const finalList = this.allTags.reduce((acc, curr) => {
      const name = curr.name.toUpperCase();
      if (name.includes(updatedText.toUpperCase())) {
        acc.push(curr);
      }
      return acc;
    }, []);

    this.setState({
      searchText: updatedText,
      listData: finalList,
    });
  };

  renderTableCell = ({item}, addedTagsId: [string]) => {
    const itemAlreadyAdded = addedTagsId.includes(item.id);
    return (
      <View style={styles.item}>
        <Text style={styles.title}>{item.name}</Text>

        {itemAlreadyAdded ? (
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => {
              this.tagRemove(item.id);
            }}>
            <Text>REMOVE</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => {
              this.tagAdd(item.id);
            }}>
            <Text>ADD</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  tagAdd = (tagId: number) => {
    const {taskTagsIds} = this.state;
    taskTagsIds.push(tagId);
    this.setState({
      taskTagsIds,
    });
    this.dataManager.attachTagToTask(tagId);
  };

  tagRemove = (tagId: number) => {
    const {taskTagsIds} = this.state;
    const index = taskTagsIds.indexOf(tagId);
    if (index > -1) {
      taskTagsIds.splice(index, 1);
    }
    this.setState({
      taskTagsIds,
    });
    this.dataManager.removeTagFromTask(tagId);
  };

  createNewTag = async () => {
    const {searchText} = this.state;
    if (searchText.length > 0) {
      this.isLoaderVisible(true);
      const newTagId = await this.dataManager.createTag(searchText);
      this.allTags.push({id: newTagId, name: searchText});
      this.isLoaderVisible(false);
      this.tagAdd(newTagId);
      this.onChangeText(searchText);
    }
  };

  render() {
    const {isVisible, hideSelf} = this.props;
    const {tagName, listData, taskTagsIds, showLoader} = this.state;
    return (
      <>
        <Modal animationType={'fade'} transparent={false} visible={isVisible}>
          <View style={styles.modal}>
            {showLoader && (
              <ActivityIndicator
                style={styles.loader}
                size="large"
                color="black"
              />
            )}
            <TextInput
              maxLength={50}
              multiline
              numberOfLines={2}
              onChangeText={(text) => this.onChangeText(text)}
              value={tagName}
              style={styles.textInput}
            />
            <View style={styles.separator} />

            {listData && listData.length === 0 && (
              <Button title="ADD TASK" onPress={this.createNewTag} />
            )}
            <FlatList
              style={styles.tableStyle}
              data={listData}
              renderItem={(item) => this.renderTableCell(item, taskTagsIds)}
              keyExtractor={(item) => String(item.id)}
            />
            <TouchableHighlight style={styles.cancelButton}>
              <Button onPress={() => hideSelf()} title={'Cancel'} />
            </TouchableHighlight>
          </View>
        </Modal>
      </>
    );
  }
}

const styles = StyleSheet.create({
  modal: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#d7d7d7',
    height: '80%',
    width: '100%',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#fff',
    marginTop: 80,
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
    marginTop: 5,
  },
  item: {
    backgroundColor: '#e0d6e2',
    padding: 10,
    marginVertical: 8,
    marginHorizontal: 16,
    flexDirection: 'row',
  },
  title: {
    width: '75%',
    height: 25,
    fontSize: 15,
    fontWeight: 'bold',
  },
  actionButton: {
    borderWidth: 1,
    borderColor: 'black',
    padding: 3,
    borderRadius: 3,
    margin: 5,
    backgroundColor: 'green',
  },
  tableStyle: {
    marginTop: 20,
    borderWidth: 1,
    borderColor: 'black',
    width: '90%',
  },
  loader: {
    left: 0,
    bottom: 0,
    top: 0,
    position: 'absolute',
    right: 0,
    zIndex: 5,
  },
});
