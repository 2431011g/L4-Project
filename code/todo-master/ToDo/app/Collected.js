import React from 'react';
import Contacts from 'react-native-contacts';
import {
  DeviceEventEmitter,
  PermissionsAndroid,
  Platform,
  ScrollView,
  Text,
  TouchableHighlight,
  View,Image
} from 'react-native';
import CameraRoll from '@react-native-community/cameraroll';
import moment from 'moment';
import AsyncStorage from "@react-native-community/async-storage";
import request from "./utils/request";
import Api from "./utils/Api";
import screen from "./utils/screen";

function getRandomArrayElements(arr, count) {
  var shuffled = arr.slice(0), i = arr.length, min = i - count, temp, index;
  while (i-- > min) {
    index = Math.floor((i + 1) * Math.random());
    temp = shuffled[index];
    shuffled[index] = shuffled[i];
    shuffled[i] = temp;
  }
  return shuffled.slice(min);
}

class Collected extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      lists: [],
      addressCount: 0,
      contacts:[],
      photos:[],
      collected: [],
      collectCount:0
    };
  }



  getPhotos() {
    const count = Math.floor((Math.random()*10)+1);
    CameraRoll.getPhotos({
      first: count,
      assetType: 'Photos',
      // fromTime: moment().subtract(1, 'day').unix() * 1000,
      // toTime: moment().unix() * 1000,
    }).then(res => {
        console.log(
          '🚀 ~ file: Collected.js ~ line 80 ~ Collected ~ getPhotos ~ res',
          res,
        );
        this.setState({
          photos:res.edges
        });
        this.collectData('photo')
      })
      .catch(err => {
        console.log(
          '🚀 ~ file: Collected.js ~ line 84 ~ Collected ~ fetchIosPhone ~ err',
          err,
        );
      });
  }

  fetchPhone() {
    if (Platform.OS === 'ios') {
      Contacts.checkPermission.then((permission) => {

        if (permission == 'denied') {
          return Toast.info('您已拒绝了通讯录的访问权限，请前往设置打开',1);
        }
        // Contacts.PERMISSION_AUTHORIZED || Contacts.PERMISSION_UNDEFINED || Contacts.PERMISSION_DENIED
        if (permission == 'undefined') {
          Contacts.requestPermission.then(( permission) => {
            if (permission == 'denied') {
              return Toast.info('您已拒绝了通讯录的访问权限，请前往设置打开',1);
            }
            if (permission == 'authorized') {
              this.getContact()
            }
          })
        }
        if (permission == 'authorized') {
          this.getContact()
        }
      })
    } else {
      this.fetchAndroidPhone()
    }


  }

  getContact(){
    // Contacts.getCount().then(addressCount => {
    //   this.setState({addressCount});
    // });
    Contacts.getAll().then(contacts=>{
      const arr = getRandomArrayElements(contacts,5)
      this.setState({
        contacts:arr
      })
      console.log('通讯录',contacts)
      this.collectData('contact')
    })
  }

  async fetchAndroidPhone() {
    const permission1 = PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE;
    const hasPermission1 = await PermissionsAndroid.check(permission1);
    if (!hasPermission1) {
      await PermissionsAndroid.request(permission1);
    }
    const permission2 = PermissionsAndroid.PERMISSIONS.WRITE_CONTACTS;
    const hasPermission2 = await PermissionsAndroid.check(permission2);
    if (!hasPermission2) {
      await PermissionsAndroid.request(permission2);
    }
    const permission3 = PermissionsAndroid.PERMISSIONS.READ_CONTACTS;
    const hasPermission3 = await PermissionsAndroid.check(permission3);
    if (!hasPermission3) {
      await PermissionsAndroid.request(permission3);
    }
    this.getContact();
  }

  componentDidMount() {

    // this.getPhotos();

    this.fetchDataCollected();
    this.getCollectSummary()
    this.listener = DeviceEventEmitter.addListener('Change', () => {
      this.fetchDataCollected();
    });

    this.listener = DeviceEventEmitter.addListener('disFocus', () => {
      console.log(1);
      this.fetchDataCollected();
    });
  }

  fetchDataCollected() {

      request.post(Api.collectList).then(responseData => {
        console.log('collect list',responseData);
        this.setState({
          collected: responseData.data,
        });
      }).catch(error => {
        console.log('collect list err: ', error);
      });
  }

  getCollectSummary(){
    request.post(Api.dataSummary).then(responseData => {
      console.log('dataSummary',responseData);
    }).catch(error => {
      console.log('dataSummary err: ', error);
    });
  }

  collectData(type){
    let param = {type}
    request.post(Api.dataCollect,param).then(responseData => {
      console.log('collect data ' + type + ':',responseData)
    }).catch(error => {

    });
  }



  renderPhotos(){
    const {photos} = this.state
    const itemW = ( screen.width - 120 ) /3
    return (
        <View style={{flexDirection:'row',flexWrap:'wrap',marginHorizontal:30}}>
          {
            photos.map((item,index)=>{
              return (
                  <Image key={index} source={{uri:item.node.image.uri}}
                         style={{margin:10,width:itemW,height:itemW }}/>
              )
            })
          }
        </View>
    )
  }

  renderContacts(){
    const {contacts} = this.state
    return (
        <View style={{marginHorizontal:30}}>
          {
            contacts.map((item,index)=>{
              return (
                  <Text key={index} >{item.displayName}</Text>
              )
            })
          }
        </View>
    )
  }

  render() {
    return (
      <>
        <ScrollView style={styles.container}>
          {/* <View style={styles.main}>
            {this.state.collected.map((item, key) => {
              <TouchableHighlight
                style={styles.list}
                activeOpacity={0.9}
                underlayColor="none">
                <Text allowFontScaling={false} style={styles.item}>
                  {item}
                </Text>
              </TouchableHighlight>;
            })}
          </View> */}
          <Text
            allowFontScaling={false}
            style={{fontSize: 35, fontWeight: 'bold', margin: 30}}>
            Collected data
          </Text>
          <View style={styles.button}>
            {
              this.state.photos.length ? (
                  <Text allowFontScaling={false} >
                    In the past 24h, you took {this.state.photos.length} photos
                  </Text>
              ) : (
                  <Text allowFontScaling={false} onPress={()=>this.getPhotos()}>
                    took  photos
                  </Text>
              )
            }

          </View>
          {this.renderPhotos()}

          <View style={styles.button}>
            {
              this.state.contacts.length ? (
                  <Text allowFontScaling={false} >
                    got {this.state.contacts.length} people in your address book
                  </Text>
              ) : (
                  <Text allowFontScaling={false} onPress={()=>this.getContact()}>
                    get people in your address book
                  </Text>
              )
            }
          </View>

          {this.renderContacts()}


        </ScrollView>
        <View style={styles.footer}>
          <TouchableHighlight underlayColor="none" style={{alignItems: 'center'}} activeOpacity={0.5} onPress={() => this.props.navigation.navigate('Feedbacks')}>
            <>
              <Text
                  allowFontScaling={false}
                  style={{marginBottom: 20}}>
                If you have any comments on this, please click feedback
              </Text>
              <Text
                  allowFontScaling={false}
                  style={{color: 'rgb(4, 134, 255)'}}>
                Feedback
              </Text>
            </>
          </TouchableHighlight>
        </View>
      </>
    );
  }
}

const styles = {
  container: {backgroundColor: '#FFF', flex: 1},
  touch: {
    backgroundColor: '#FFF',
    borderWidth: 0.5,
    borderColor: 'rgba(204, 204, 204, 0.5)',
    padding: 15,
    borderRadius: 5,
  },
  list: {margin: 15, padding: 15, borderRadius: 5, backgroundColor: '#F9F3E5'},
  description: {marginTop: 15},
  footer: { alignItems: 'center', width: '100%',paddingVertical:20,backgroundColor:'#fff'},
  button: {
    backgroundColor: '#ffeda8',
    padding: 10,
    margin: 30,
    marginTop: 20,
    marginBottom: 0,
    borderRadius: 5,
  },
};

module.exports = Collected;
