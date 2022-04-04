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

class Task extends React.Component {
  constructor(props) {
    super(props);
    const getState = props.navigation.getState()
    console.log('task: ', getState.routes[4]['params']);

    this.state = {
      lists: [],
      params: getState.routes[4]['params'],
      session_id: null
    };

    AsyncStorage.getItem('session_id')
    .then((response) => {
      this.setState({
        session_id: response
      })

      Logs({
        url: 'http://175.24.183.174:8080/page/log',
        session_id: response,
        page_id: 1
      }, (data) => {
        console.log(data)
      })

      this.fetchData()
    })
  }

  componentWillUnmount() {
    DeviceEventEmitter.emit('Change')
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
      console.log('responseData', responseData);
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

  fetchDelete () {
    fetch(`http://175.24.183.174:8080/task/delete`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'session_id': this.state.session_id
      },
      body: JSON.stringify({
        task_id: this.state.params.task_id
      })
    })
    .then(response => response.json())
    .then(responseData => {
      console.log(responseData);
      if (responseData.status == 'success') {
        this.props.navigation.goBack()
      }
    })
    .catch((error) => {
      console.log('err: ', error)
    })
  }

  fetchComplete () {
    console.log({
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'session_id': this.state.session_id
      },
      body: JSON.stringify({
        task_id: this.state.params.task_id
      })
    });

    fetch(`http://175.24.183.174:8080/task/complete`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'session_id': this.state.session_id
      },
      body: JSON.stringify({
        task_id: this.state.params.task_id
      })
    })
    .then(response => response.json())
    .then(responseData => {
      console.log(responseData);
      if (responseData.status == 'success') {
        this.fetchData()
      }
    })
    .catch((error) => {
      console.log('err: ', error)
    })
  }

  render() {
    return (
      <>
        <ScrollView>
          <View style={styles.container}>
            {
              this.state.lists.map((item, key) => {
                if (this.state.params.task_id == item.task_id) {
                  return (
                    <TouchableHighlight style={styles.list} key={key} activeOpacity={0.9} underlayColor="none">
                      <View key={key}>
                        <Image resizeMode='cover' style={styles.task_status} source={{uri: item.task_status == 'in_progress' ? icons.checkboxNormal : icons.checkboxCompleted}} />
                        <Text allowFontScaling={false} style={{...styles.item, paddingLeft: 35, fontSize: 22}}>{item.task_name}</Text>
                        <Text allowFontScaling={false} style={styles.description}>{item.complete_time}</Text>
                      </View>
                    </TouchableHighlight>
                  )
                }
              })
            }
          </View>
        </ScrollView>
        <TouchableHighlight underlayColor="none" activeOpacity={0.5} style={styles.completetask} onPress={() => this.fetchComplete()}>
          <Text allowFontScaling={false} style={{color: '#FFF'}}>Swi</Text>
        </TouchableHighlight>
        <TouchableHighlight underlayColor="none" activeOpacity={0.5} style={styles.deltask} onPress={() => this.fetchDelete()}>
          <Text allowFontScaling={false} style={{color: '#FFF'}}>Del</Text>
        </TouchableHighlight>
      </>
    );
  }
}

const styles = {
  touch: { backgroundColor: '#FFF', borderWidth: 0.5, borderColor: 'rgba(204, 204, 204, 0.5)', padding: 15, borderRadius: 5 },
  list: { margin: 15, padding: 15, borderRadius: 5, backgroundColor: '#FFF' },
  description: { marginTop: 15 },
  completetask: { position: 'absolute', bottom: 50, left: 30, backgroundColor: '#000000', width: 60, height: 60, borderRadius: 60, alignItems: 'center', justifyContent: 'center' },
  deltask: { position: 'absolute', bottom: 50, right: 30, backgroundColor: '#ff0000', width: 60, height: 60, borderRadius: 60, alignItems: 'center', justifyContent: 'center' },
  task_status: {width: 25, height: 25, position: 'absolute', top: 0, left: 0},
}

module.exports = Task;
