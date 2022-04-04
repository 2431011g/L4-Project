import React, { Component } from 'react';
import Logs from './Logs';
import icons from './Icons';
import Moment from 'moment';
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
      session_id: null,

      modalVisible: false,
      location: {
        latitude: '',
        longitude: ''
      },
      geocode: {
        country: '',
        province: '',
        street: ''
      },
      type: 1,
      typeIndex: 0,
      typeText: ['country', 'province', 'street'],
    };

    this.location()

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

  async location () {
    await Location.init()
    Initializer.init('t3STBqjGSTnrbnYWhMABesjZ5GGphLXU').catch(e => console.error(e))
    Location.addLocationListener(location => {
      // console.log('location', location)
      this.setState({ location })
    })
    // const geocode = await Geocode.reverse({ latitude: this.state.location.latitude, longitude: this.state.location.longitude })
    // this.setState({ geocode })
    // console.log('reverseResult', geocode)
    Location.start()
  }

  render() {
    return (
      <>
        <ScrollView>
          <View>
            <TouchableHighlight underlayColor="none" activeOpacity={0.5} style={styles.touch} onPress={() => this.setState({type: 1, typeIndex: 0, modalVisible: true})}>
              <Text allowFontScaling={false}>Open Modal Map - Country</Text>
            </TouchableHighlight>
            <TouchableHighlight underlayColor="none" activeOpacity={0.5} style={styles.touch} onPress={() => this.setState({type: 1, typeIndex: 1, modalVisible: true})}>
              <Text allowFontScaling={false}>Open Modal Map - Province</Text>
            </TouchableHighlight>
            <TouchableHighlight underlayColor="none" activeOpacity={0.5} style={styles.touch} onPress={() => this.setState({type: 1, typeIndex: 2, modalVisible: true})}>
              <Text allowFontScaling={false}>Open Modal Map - Street</Text>
            </TouchableHighlight>
          </View>
          <Modal animationType="slide" visible={this.state.modalVisible} transparent={true}>
            <View style={{flex: 1, backgroundColor: this.state.type == 0 ? 'rgba(204, 204, 204, 0.85)' : '#FFF'}}>
              {
                this.state.type == 1 ? (
                  <>
                    <MapView
                      // satellite
                      // showsUserLocation={true}
                      zoomLevel={15}
                      location={this.state.location}
                      center={{ latitude: this.state.location.latitude, longitude: this.state.location.longitude }}
                      // center={{ latitude: 39.2, longitude: 112.4 }}
                      locationEnabled
                      style={{width: '100%', height: '50%'}}
                      onLoad={async () => {
                        // await this.location()
                        // console.log('onLoad', this.state.location)
                        var geocode = await Geocode.reverse({ latitude: this.state.location.latitude, longitude: this.state.location.longitude })
                        // console.log(geocode);
                        this.setState({ geocode })
                      }}
                      // onClick={point => console.log(point)}
                      // onStatusChange={status => console.log(status)}
                    >
                    </MapView>
                    <Text allowFontScaling={false} style={{...styles.geocode}}>
                    {
                      this.state.typeText[this.state.typeIndex] == 'country' ? 'Country: ' + this.state.geocode.country : ''
                    }
                    {
                      this.state.typeText[this.state.typeIndex] == 'province' ? 'Province: ' + this.state.geocode.province : ''
                    }
                    {
                      this.state.typeText[this.state.typeIndex] == 'street' ? 'Street: ' + this.state.geocode.street : ''
                    }
                    </Text>
                    <View style={{ flex: 1, flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-around', marginBottom: '15%' }}>
                      <TouchableHighlight underlayColor="none" activeOpacity={0.5} style={styles.reject} onPress={() => this.setState({modalVisible: false})}>
                        <Text allowFontScaling={false}>No</Text>
                      </TouchableHighlight>
                      <TouchableHighlight underlayColor="none" activeOpacity={0.5} style={styles.accept} onPress={() => {
                        this.fetchLocationRecord(this.state.location.longitude, this.state.location.latitude, JSON.stringify(this.state.geocode))
                        this.setState({modalVisible: false})
                      }}>
                        <Text allowFontScaling={false}>Yes</Text>
                      </TouchableHighlight>
                    </View>
                  </>
                ) : (<></>)
              }
            </View>
          </Modal>
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
  geocode: { fontSize: 18, textAlign: 'center', margin: 20 },
  modalText: { fontSize: 16, marginBottom: 10 },
  accept: { borderColor: '#000', borderWidth: 1, backgroundColor: '#F2CAC5', padding: 15, borderRadius: 20, width: 120, alignItems: 'center', marginHorizontal: 16 },
  reject: { borderColor: '#000', borderWidth: 1, backgroundColor: '#F2CAC5', padding: 15, borderRadius: 20, width: 120, alignItems: 'center', marginHorizontal: 16 },
  addtask: { display: 'none', position: 'absolute', bottom: 50, right: 30, backgroundColor: '#000', width: 60, height: 60, borderRadius: 60, alignItems: 'center', justifyContent: 'center'}
}

module.exports = LocationLogs;
