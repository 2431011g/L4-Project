import React from 'react';
import icons from './Icons';
import {Alert, Image, Modal, Text, TextInput, TouchableHighlight, View,} from 'react-native';
import AsyncStorage from "@react-native-community/async-storage";
import {AppConfig} from "./utils/constants";
import {reset} from "./utils/NavigationUtil";
// import {Initializer, Location} from "react-native-baidumap-sdk";
import locationUtil from "./utils/LocationUtil";

class Welcome extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
    };
  }

  componentDidMount() {
    AsyncStorage.getItem('first').then(res=>{
      if(!res) {
        this.setState({
          modalVisible: true
        })
      }
    })

    AsyncStorage.getItem('session_id').then(res=>{
      console.log(res)
      if(res){
        AppConfig.sessionId = res
      }
    })
    // Initializer.init('w7YstFazBrEXtXbHMZmNIdo6Et1YvP7Z').catch(e => console.log(e))
    locationUtil.initSDK()
  }

  reject() {
    Alert.alert('Tips', 'Oops!!! Unable to use the app. You need permission.', [
      {
        text: 'OK',
        onPress: () => {}
      }
    ])
  }

  renderModal(){
    return (
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
                <TouchableHighlight underlayColor="none" activeOpacity={0.5} style={styles.accept} onPress={() => {
                  this.setState({modalVisible: false})
                  AsyncStorage.setItem('first','1')
                }}>
                  <Text allowFontScaling={false}>Accept all</Text>
                </TouchableHighlight>
              </View>
            </>
          </View>
        </Modal>
    )
  }

  render () {
    return (
        <View style={styles.container}>
          <Image resizeMode='cover' style={{width: 240, height: 240}} source={{uri: icons.welcome}} />
          <View style={{marginTop: 30, flex: 1, alignItems: 'center', justifyContent: 'space-between'}}>
            <Text style={{fontSize: 20, marginBottom: 10, fontWeight: '600'}}>Get things done with ToDO</Text>
            <TouchableHighlight underlayColor="none" activeOpacity={0.5} onPress={() => {
              if(AppConfig.sessionId){
                reset(this.props.navigation,'Main')
              }else{
                reset(this.props.navigation,'Login')
                // this.setState({ type: 'login' })
              }
            }}>
              <View style={{marginBottom: 30, flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                <Text style={{fontSize: 20}}>Enter</Text>
                <Image resizeMode='cover' style={{width: 40, height: 20}} source={{uri: icons.next}} />
              </View>
            </TouchableHighlight>
          </View>
          {this.renderModal()}
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
    paddingTop: 130,
    width: '100%',
    backgroundColor: '#FFF',
  },


  textInput: {
    width: '100%',
    borderColor: '#d3d6d9',
    borderWidth: 1,
    padding: 15,
    marginTop: 10,
    fontWeight: '700',
    borderRadius: 0,
    color: '#111',
    textAlign: 'left'
  },
  textSubmitFoot: {
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

module.exports = Welcome;
