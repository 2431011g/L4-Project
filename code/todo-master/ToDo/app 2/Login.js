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

class Login extends React.Component {
  static navigationOptions = ({navigation, screenProps}) => ({
    headerTitle: (
      <TouchableHighlight
        underlayColor='transparent'
      >
        <>
          <Text allowFontScaling={false} numberOfLines={1} style={{
            fontSize: 17,
            fontWeight: '600',
            color: 'rgba(0, 0, 0, .9)',
            textAlign: 'center',
            marginHorizontal: 0
          }}>Login</Text>
        </>
      </TouchableHighlight>
    ),
    headerRight: (
      <TouchableHighlight
        underlayColor='transparent'
        style={{paddingLeft: 10, paddingRight: 10}}
        onPress={() => {
          navigation.navigate('Register')
        }}
      >
        <Text allowFontScaling={false} style={{fontSize: 15}}>Register</Text>
      </TouchableHighlight>
    ),
    tabBarVisible: false,
    headerStyle: {
      elevation: 0,
    },
  });

  constructor(props) {
    super(props);

    this.state = {
      user_name: "",
      password: "",
      modalVisible: true
    };
  }

  reject() {
    Alert.alert('Tips', 'Oops!!! Unable to use the app. You need permission.', [
      {
        text: 'OK',
        onPress: () => {}
      }
    ])
  }

  fetchLogin () {
    fetch(`http://175.24.183.174:8080/user/login`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user_name: this.state.user_name,
        password: this.state.password
      })
    })
    .then(response => response.json())
    .then(responseData => {
      console.log(responseData)
      if(responseData.status == "success") {
        AsyncStorage.setItem('session_id', JSON.stringify(responseData.session_id))
        this.props.navigation.navigate('Home')
      } else {
        Alert.alert('Tips', responseData.error_message, [
          {
            text: 'OK'
          }
        ])
      }
    })
    .catch((error) => {
      console.log('err: ', error)
    })
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.textInputContainer}>
          <Text allowFontScaling={false}>Username</Text>
          <TextInput
            allowFontScaling={false}
            style={styles.textInput}
            placeholder=""
            clearButtonMode="while-editing"
            defaultValue={this.state.user_name}
            placeholderTextColor="#CCC"
            onChangeText={(user_name) => this.setState({ user_name: user_name.toLowerCase() })}
          />
        </View>
        <View style={styles.textInputContainer}>
          <Text allowFontScaling={false}>Password</Text>
          <TextInput
            allowFontScaling={false}
            style={styles.textInput}
            placeholder=""
            clearButtonMode="while-editing"
            password={true}
            defaultValue={this.state.password}
            placeholderTextColor="#CCC"
            secureTextEntry
            onChangeText={(password) => this.setState({ password })}
          />
        </View>
        <View style={styles.textSubmitFoot}>
          <TouchableHighlight
            style={{backgroundColor: '#5e5e5e', padding: 10, borderRadius: 20}}
            onPress={() => {
              if (this.state.user_name.length > 0 && this.state.password.length > 0) {
                this.fetchLogin()
              } else {
                Alert.alert('Tips', 'Please re-enter', [
                  {
                    text: 'OK',
                    onPress: () => {}
                  }
                ])
              }
            }}
          >
            <>
              <Text allowFontScaling={false} numberOfLines={1} style={{
                fontSize: 14,
                fontWeight: '600',
                color: 'rgba(255, 255, 255, 0.9)',
                textAlign: 'center',
                marginHorizontal: 16
              }}>Login</Text>
            </>
          </TouchableHighlight>
        </View>
        <View style={{flex: 1, justifyContent: 'flex-end', marginBottom: 30}}>
          <TouchableHighlight
            underlayColor='transparent'
            onPress={() => {
              this.props.navigation.navigate('Register')
            }}
          >
            <Text allowFontScaling={false} style={{color: 'rgb(27, 140, 203)'}}>No Account? Register.</Text>
          </TouchableHighlight>
        </View>

        <Modal animationType="slide" visible={this.state.modalVisible} transparent={true}>
          <View style={{flex: 1, backgroundColor: this.state.type == 0 ? 'rgba(204, 204, 204, 0.85)' : '#FFF'}}>
            <>
              <View style={styles.modal}>
                <View style={{alignItems: 'center', justifyContent: 'center'}}>
                  <Image resizeMode='contain' style={styles.policy} source={{uri: icons.policy}} />
                </View>
                <Text allowFontScaling={false} style={styles.modalTitle}>ToDo Policy</Text>
                <Text allowFontScaling={false} style={styles.modalText}>Your privacy preferences We and our partners store and/or access information on a device,e.g.unique identifers in cookies, in order to process personal data. You can accept o manage your preferences,including your right to object if you have a legitimate interest.Please click on"Manage cookies" or visit the privacy policy page at any time. These preferences are signalled to our partners and will not affect your experience. Cookie policy</Text>
                <Text allowFontScaling={false} style={styles.modalText}>We process data for the following purposes Use precise geolocation data.Actively scan device characteristics for identification.Store and/or access information on a device.Personalised ads and content,ad and content measurement,audience insights and product development. List of Partners(vendors)</Text>
                <Text allowFontScaling={false} style={{textAlign: 'center', fontWeight: '600', ...styles.modalText}}>*** Our experiments must be carried out with the above permission obtained from you. ***</Text>
              </View>
              <View style={{ flex: 1, flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-around', marginBottom: '15%' }}>
                <TouchableHighlight underlayColor="none" activeOpacity={0.5} style={styles.reject} onPress={() => this.reject()}>
                  <Text allowFontScaling={false}>Reject all</Text>
                </TouchableHighlight>
                <TouchableHighlight underlayColor="none" activeOpacity={0.5} style={styles.accept} onPress={() => this.setState({modalVisible: false})}>
                  <Text allowFontScaling={false}>Accept all</Text>
                </TouchableHighlight>
              </View>
            </>
          </View>
        </Modal>
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
  textInput: {
    width: '100%',
    borderColor: '#d3d6d9',
    borderWidth: 1,
    borderRadius: 4,
    padding: 15,
    marginTop: 10,
    fontWeight: '700',
    borderRadius: 0,
    color: '#111',
    textAlign: 'left'
  },
  textSubmitFoot: {
    height: 200,
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  textInputContainer: {
    width: '100%',
    marginBottom: 30
  },
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
  accept: { borderColor: '#000', borderWidth: 1, backgroundColor: '#F2CAC5', height: 45, justifyContent: 'center', borderRadius: 20, width: 120, alignItems: 'center', marginHorizontal: 16 },
  reject: { borderColor: '#000', borderWidth: 1, backgroundColor: '#F2CAC5', height: 45, justifyContent: 'center', borderRadius: 20, width: 120, alignItems: 'center', marginHorizontal: 16 },
  addtask: { display: 'none', position: 'absolute', bottom: 50, right: 30, backgroundColor: '#000', width: 60, height: 60, borderRadius: 60, alignItems: 'center', justifyContent: 'center'}
}

module.exports = Login;
