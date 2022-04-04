import React, { Component } from 'react';
import icons from './Icons';
import md5 from "react-native-md5";
import {
  Text,
  View,
  Image,
  Alert,
  Modal,
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

class My extends React.Component {

  constructor(props) {
    super(props);

    this.state = {

    };
  }

  render() {
    return (
      <View style={styles.container}>
        <Image resizeMode='cover' style={{width: 120, height: 125}} source={{uri: icons.avator}} />
        <View style={{marginTop: 30, alignItems: 'center'}}>
          <Text style={{fontSize: 20, marginBottom: 10}}>Afsar Hossen</Text>
          <Text>Imshuvo97@gmail.com</Text>
        </View>
      </View>
    );
  }
}

const styles = {
  container: {
    position: 'relative',
    flex: 1,
    alignItems: 'center',
    padding: 15,
    paddingTop: 30,
    width: '100%',
    backgroundColor: '#FFF'
  },
}

module.exports = My;
