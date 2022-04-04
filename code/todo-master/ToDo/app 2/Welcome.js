import React, { Component } from 'react';
import icons from './Icons';
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

class Welcome extends React.Component {

  constructor(props) {
    super(props);

    this.state = {

    };
  }

  render() {
    return (
      <View style={styles.container}>
        <Image resizeMode='cover' style={{width: 240, height: 240}} source={{uri: icons.welcome}} />
        <View style={{marginTop: 30, flex: 1, alignItems: 'center', justifyContent: 'space-between'}}>
          <Text style={{fontSize: 20, marginBottom: 10, fontWeight: '600'}}>Get things done with ToDO</Text>
          <TouchableHighlight underlayColor="none" activeOpacity={0.5} onPress={() => this.props.navigation.navigate('Login')}>
            <View style={{marginBottom: 30, flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
              <Text style={{fontSize: 20}}>Enter</Text>
              <Image resizeMode='cover' style={{width: 40, height: 20}} source={{uri: icons.next}} />
            </View>
          </TouchableHighlight>
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

module.exports = Welcome;
