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

class Map extends React.Component {
  constructor(props) {
    super(props);
    const getState = props.navigation.getState()
    console.log(getState);

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
        page_id: 5
      }, (data) => {
        console.log(data)
      })
    })
  }

  componentDidMount() {
  }

  async location () {
    await Location.init()
    Initializer.init('w7YstFazBrEXtXbHMZmNIdo6Et1YvP7Z').catch(e => console.error(e))
    Location.addLocationListener(location => {
      this.setState({ location })
    })
    Location.start()
  }

  render() {
    return (
      <View style={{flex: 1, backgroundColor: '#FFF'}}>
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

        </Text>
        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-around', marginBottom: '15%' }}>
          <TouchableHighlight underlayColor="none" activeOpacity={0.5} style={styles.reject} onPress={() => this.setState({modalVisible: false})}>
            <Text allowFontScaling={false} style={{color: '#FFF'}}>Back</Text>
          </TouchableHighlight>
        </View>
      </View>
    );
  }
}

const styles = {
  // container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  touch: { backgroundColor: '#FFF', borderWidth: 0.5, borderColor: 'rgba(204, 204, 204, 0.5)', padding: 15, borderRadius: 5 },
  list: {margin: 15, padding: 15, borderRadius: 5, backgroundColor: '#FFF'},
  description: {marginTop: 15},
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
  accept: { backgroundColor: '#01aecc', padding: 15, borderRadius: 20, width: 120, alignItems: 'center', marginHorizontal: 16 },
  reject: { backgroundColor: '#878787', padding: 15, borderRadius: 20, width: 120, alignItems: 'center', marginHorizontal: 16 },
}

module.exports = Map;
