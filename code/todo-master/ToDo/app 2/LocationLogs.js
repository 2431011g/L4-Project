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

class LocationLogs extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      lists: [],
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
        page_id: 4
      }, (data) => {
        console.log(data)
      })

      this.fetchData()
    })
  }

  fetchData () {
    fetch(`http://175.24.183.174:8080/location/logs`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'session_id': this.state.session_id
      },
      body: {}
    })
    .then(response => response.json())
    .then(responseData => {
      if (responseData.status == 'success') {
        for (var i = 2; i < responseData.data.length; i++) {
          if (responseData.data[i].place) {
            var parse = JSON.parse(responseData.data[i].place)
            console.log(parse);
            responseData.data[i].parse = parse
          }
        }

        this.setState({
          lists: responseData.data
        })
      }
    })
    .catch((error) => {
      console.log('err: ', error)
    })
  }

  onScrollView () {
    this.fetchData()
  }

  componentDidMount() {
    this.listener = DeviceEventEmitter.addListener('disFocus', () => {
      this.fetchData()
    })

    this.listener = DeviceEventEmitter.addListener('Change', () => {
      this.fetchData()
    })
  }

  render() {
    return (
      <>
        <ScrollView onScroll={this.onScrollView.bind(this)}>
          <View style={styles.container}>
            {
              this.state.lists.map((item, key) => {
                return (
                  <TouchableHighlight style={styles.list} key={key} activeOpacity={0.9} underlayColor="none" onPress={() => this.props.navigation.navigate('Map', { longitude: item.parse ? item.parse.longitude : '', latitude: item.parse ? item.parse.latitude : '' })}>
                    <View>
                      <Text allowFontScaling={false} style={styles.item}>{item.parse ? item.parse.address : ''}</Text>
                      <Text allowFontScaling={false} style={styles.description}>{item.create_time}</Text>
                    </View>
                  </TouchableHighlight>
                )
              })
            }
          </View>
        </ScrollView>
      </>
    );
  }
}

const styles = {
  touch: { backgroundColor: '#FFF', borderWidth: 0.5, borderColor: 'rgba(204, 204, 204, 0.5)', padding: 15, borderRadius: 5 },
  list: { margin: 15, padding: 15, borderRadius: 5, backgroundColor: '#F8ECC1', borderColor: '#000', borderWidth: 1},
  description: { marginTop: 15 },
}

module.exports = LocationLogs;
