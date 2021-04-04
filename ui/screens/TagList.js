import React from 'react';
import {
  ActivityIndicator,
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TextInput,
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
  editTagText: string,
  editTagId: number,
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
      editTagText: '',
      editTagId: 0,
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
      editTagText: '',
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

  editTag = async () => {
    const {editTagText, editTagId} = this.state;
    this.isLoaderVisible(true);
    await this.dataManager.updateTagName(editTagId, editTagText);
    await this.getTags();
    this.showEditTagPopUp(false);
    this.isLoaderVisible(false);
  };

  deleteTag = async (tagId: number) => {
    this.isLoaderVisible(true);
    await this.dataManager.deleteTag(tagId);
    await this.getTags();
    this.isLoaderVisible(false);
  };

  onChangeText = (text) => {
    this.setState({
      editTagText: text,
    });
  };

  renderTableCell = ({item}) => {
    const tag: Tag = item;
    return (
      <View style={styles.item}>
        <Text style={styles.title}>{tag.name}</Text>
        <TouchableOpacity
          style={[styles.actionButton, {marginRight: 10}]}
          onPress={() => {
            this.setState({
              editTagId: tag.id,
            });
            this.showEditTagPopUp(true);
          }}>
          <Text>EDIT</Text>
        </TouchableOpacity>
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

  renderEditTagPopUp = (isVisible) => {
    return (
      <Modal animationType="slide" transparent={true} visible={isVisible}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <TextInput
              onChangeText={this.onChangeText}
              style={styles.modalText}
              maxLength={50}
            />
            <TouchableOpacity
              style={styles.buttonDone}
              onPress={() => this.editTag()}>
              <Text style={styles.textStyle}>Done</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.buttonCancel}
              onPress={() => this.showEditTagPopUp(false)}>
              <Text style={styles.textStyle}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  };

  render() {
    const {showLoader, showError, tags, showEditTagPopUp} = this.state;
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
        {this.renderEditTagPopUp(showEditTagPopUp)}
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
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    width: '75%',
    borderWidth: 1,
    borderColor: 'black',
    textAlign: 'center',
    height: 45,
  },
  buttonDone: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    backgroundColor: '#76c7e3',
  },
  buttonCancel: {
    marginTop: 5,
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    backgroundColor: '#e38888',
  },
});
