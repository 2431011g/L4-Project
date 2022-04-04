import React, { Component } from 'react';
import Logs from './Logs';
import icons from './Icons';
// import Contacts from 'react-native-contacts';
import { MapView, Location, Initializer, Geocode } from 'react-native-baidumap-sdk';
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

class Collected extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      lists: [],
      session_id: null
    };
  }

  componentDidMount() {
    // Contacts.checkPermission((err, permission) => {
    //      if (err) throw err;
    //        if (permission == 'denied') {
    //             return Toast.info('您已拒绝了通讯录的访问权限，请前往设置打开',1)
    //         }
    //  // Contacts.PERMISSION_AUTHORIZED || Contacts.PERMISSION_UNDEFINED || Contacts.PERMISSION_DENIED
    //       if (permission == 'undefined') {
    //          Contacts.requestPermission((err, permission) => {
    //            if (permission == 'denied') {
    //               return Toast.info('您已拒绝了通讯录的访问权限，请前往设置打开',1);
    //             }
    //               if (permission == 'authorized') {
    //                   this.go2Page();
    //               }
    //         })
    //       }
    //       if (permission == 'authorized') {
    //          this.go2Page();
    //       }
    // })
  }

  render() {
    return (
      <>
        <ScrollView style={styles.container}>
          <View>
            <TouchableHighlight style={styles.list} activeOpacity={0.9} underlayColor="none">
              <Text allowFontScaling={false} style={styles.item}>... in your address book</Text>
            </TouchableHighlight>
            <TouchableHighlight style={styles.list} activeOpacity={0.9} underlayColor="none">
              <Text allowFontScaling={false} style={styles.item}>In the past 24h, you took 5 photos</Text>
            </TouchableHighlight>
          </View>
        </ScrollView>
      </>
    );
  }
}

const styles = {
  container: {backgroundColor: '#FFF', flex: 1},
  touch: { backgroundColor: '#FFF', borderWidth: 0.5, borderColor: 'rgba(204, 204, 204, 0.5)', padding: 15, borderRadius: 5 },
  list: { margin: 15, padding: 15, borderRadius: 5, backgroundColor: '#F9F3E5'},
  description: { marginTop: 15 },
}

module.exports = Collected;
