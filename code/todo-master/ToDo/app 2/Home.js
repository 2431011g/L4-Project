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

class Home extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
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
      lists: [],
      type: 1,
      typeIndex: 0,
      typeText: ['country', 'province', 'street'],

      session_id: null
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
        page_id: 2
      }, (data) => {
        console.log(data)
      })

      this.fetchData()
      this.fetchNeedWindow()
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

  fetchNeedWindow () {
    fetch(`http://175.24.183.174:8080/page/need_window`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'session_id': this.state.session_id
      }
    })
    .then(response => response.json())
    .then(responseData => {
      console.log('need_window', responseData)
      if (responseData.need) {
        Alert.alert('Tips', responseData.content, [
          {
            text: 'OK',
            onPress: () => {}
          }
        ])
      }
    })
    .catch((error) => {
      console.log('err: ', error)
    })
  }

  fetchLocationRecord (longitude, latitude, place) {
    console.log(longitude, latitude, place);
    fetch(`http://175.24.183.174:8080/location/record`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'session_id': this.state.session_id
      },
      body: JSON.stringify({
        longitude: longitude.toString(),
        latitude: latitude.toString(),
        place
      })
    })
    .then(response => response.json())
    .then(responseData => {
      console.log('record', responseData)
    })
    .catch((error) => {
      console.log('err: ', error)
    })
  }

  fetchData () {
    fetch(`http://175.24.183.174:8080/task/list`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'session_id': this.state.session_id
      }
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

  async location () {
    await Location.init()
    Initializer.init('w7YstFazBrEXtXbHMZmNIdo6Et1YvP7Z').catch(e => console.error(e))
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
      <View style={{backgroundColor: '#F2CAC5', flex: 1}}>
        <View style={{display: 'none'}}>
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
        <ScrollView>
          <View style={styles.container}>
            <TouchableHighlight style={styles.list} activeOpacity={0.9} underlayColor="none" onPress={() => this.props.navigation.navigate('TaskList', { tag: 'experiment' })}>
              <View>
                <Text allowFontScaling={false} style={{fontSize: 24, padding: 10}}>Experiment</Text>
              </View>
            </TouchableHighlight>
            <TouchableHighlight style={styles.list} activeOpacity={0.9} underlayColor="none" onPress={() => this.props.navigation.navigate('TaskList', { tag: 'study' })}>
              <View>
                <Text allowFontScaling={false} style={{fontSize: 24, padding: 10}}>Study</Text>
              </View>
            </TouchableHighlight>
            <TouchableHighlight style={styles.list} activeOpacity={0.9} underlayColor="none" onPress={() => this.props.navigation.navigate('TaskList', { tag: 'daily' })}>
              <View>
                <Text allowFontScaling={false} style={{fontSize: 24, padding: 10}}>Daily</Text>
              </View>
            </TouchableHighlight>
            {
              this.state.lists && this.state.lists.map((item, key) => {
                return (
                  <TouchableHighlight style={styles.list} key={key} activeOpacity={0.9} underlayColor="none" onPress={() => this.props.navigation.navigate('Task', { task_id: item.task_id })}>
                    <View key={key}>
                      <Text allowFontScaling={false} style={styles.item}>{item.task_name}</Text>
                      <Text allowFontScaling={false} style={styles.item}>{item.task_date}</Text>
                      <Image resizeMode='cover' style={styles.task_status} source={{uri: item.task_status == 'in_progress' ? icons.check : icons.checked}} />
                      <Text allowFontScaling={false} style={styles.description}>{item.complete_time}</Text>
                    </View>
                  </TouchableHighlight>
                )
              })
            }
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
                          console.log('onLoad', this.state.location)
                          var geocode = await Geocode.reverse({ latitude: this.state.location.latitude, longitude: this.state.location.longitude })
                          console.log(geocode);
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
          </View>
        </ScrollView>
        <TouchableHighlight underlayColor="none" activeOpacity={0.5} style={styles.addtask} onPress={() => this.props.navigation.navigate('Add')}>
          <Text allowFontScaling={false} style={{color: '#FFF'}}>ADD</Text>
        </TouchableHighlight>
      </View>
    );
  }
}

const styles = {
  container: { marginTop: 120, flex: 1, justifyContent: 'center' },
  touch: { backgroundColor: '#FFF', borderWidth: 0.5, borderColor: 'rgba(204, 204, 204, 0.5)', padding: 15, borderRadius: 5 },
  list: {margin: 15, padding: 15, borderRadius: 5, backgroundColor: '#F8ECC1', borderColor: '#000', borderWidth: 1},
  description: {marginTop: 15},
  task_status: {width: 15, height: 15, position: 'absolute', top: 0, right: 0},
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

module.exports = Home;
