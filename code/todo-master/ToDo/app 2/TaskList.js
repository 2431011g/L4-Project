import React, { Component } from 'react';
import Logs from './Logs';
import icons from './Icons';
import { MapView, Location, Initializer, Geocode } from 'react-native-baidumap-sdk'
import {
  Text,
  View,
  Modal,
  Alert,
  Image,
  StatusBar,
  ScrollView,
  Dimensions,
  FlatList,
  SectionList,
  Platform,
  TextInput,
  AsyncStorage,
  RefreshControl,
  KeyboardAvoidingView,
  ActivityIndicator,
  DeviceEventEmitter,
  TouchableHighlight,
} from 'react-native';

class TaskList extends React.Component {
  constructor(props) {
    super(props);
    const getState = props.navigation.getState()
    console.log('getState.routes', getState.routes);

    this.state = {
      params: getState.routes[3]['params'],
      lists: [],
      session_id: null
    };

    AsyncStorage.getItem('session_id')
    .then((response) => {
      this.setState({
        session_id: response
      })

      this.fetchData()
    })
  }

  componentDidMount() {
    this.listener = DeviceEventEmitter.addListener('Change', () => {
      this.fetchData()
    })

    this.listener = DeviceEventEmitter.addListener('disFocus', () => {
      this.fetchData()
    })
  }

  fetchData () {
    fetch(`http://175.24.183.174:8080/task/list`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'session_id': this.state.session_id
      },
      body: JSON.stringify({
        tag: this.state.params.tag || 'study'
      })
    })
    .then(response => response.json())
    .then(responseData => {
      console.log(this.state.session_id, responseData)
      if (responseData.status == 'success') {
        this.setState({
          lists: responseData.data
        })
      }
      if (responseData.status == 'fail') {
        this.props.navigation.navigate('Login')
      }
    })
    .catch((error) => {
      console.log('err: ', error)
    })
  }

  render() {
    return (
      <View>
        <ScrollView>
          <View style={styles.container}>
            {
              this.state.lists && this.state.lists.map((item, key) => {
                return (
                  <TouchableHighlight style={styles.list} key={key} activeOpacity={0.9} underlayColor="none" onPress={() => this.props.navigation.navigate('Task', { task_id: item.task_id, tag: item.tag })}>
                    <View key={key}>
                      <Image resizeMode='cover' style={styles.task_status} source={{uri: item.task_status == 'in_progress' ? icons.checkboxNormal : icons.checkboxCompleted}} />
                      <Text allowFontScaling={false} style={{...styles.item, paddingLeft: 35, fontSize: 22}}>{item.task_name}</Text>
                      <Text allowFontScaling={false} style={styles.description}>{item.complete_time}</Text>
                    </View>
                  </TouchableHighlight>
                )
              })
            }
          </View>
        </ScrollView>
      </View>
    );
  }
}

const styles = {
  // container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  touch: { backgroundColor: '#FFF', borderWidth: 0.5, borderColor: 'rgba(204, 204, 204, 0.5)', padding: 15, borderRadius: 5 },
  list: {margin: 15, padding: 15, borderRadius: 5, backgroundColor: '#F8ECC1', borderColor: '#000', borderWidth: 1},
  description: {marginTop: 15},
  task_status: {width: 25, height: 25, position: 'absolute', top: 0, left: 0},
  // policy
  policy: {
    width: 90,
    height: 90,
    marginRight: 40,
    marginBottom: 20
  },
  modal: {
    padding: 15,
    marginTop: 80
  },
  modalTitle: {
    fontWeight: '800',
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 10
  },
  geocode: { fontSize: 18, textAlign: 'center', margin: 20 },
  modalText: { fontSize: 16, marginBottom: 10 },
  accept: { borderColor: '#000', borderWidth: 1, backgroundColor: '#F2CAC5', padding: 15, borderRadius: 20, width: 120, alignItems: 'center', marginHorizontal: 16 },
  reject: { borderColor: '#000', borderWidth: 1, backgroundColor: '#F2CAC5', padding: 15, borderRadius: 20, width: 120, alignItems: 'center', marginHorizontal: 16 },
  addtask: { display: 'none', position: 'absolute', bottom: 50, right: 30, backgroundColor: '#000', width: 60, height: 60, borderRadius: 60, alignItems: 'center', justifyContent: 'center'}
}

module.exports = TaskList;
