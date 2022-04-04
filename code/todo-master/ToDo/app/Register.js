import React from 'react';
import {Alert, Text, TextInput, TouchableHighlight, View,} from 'react-native';
import request from "./utils/request";
import Api from "./utils/Api";
import AsyncStorage from "@react-native-community/async-storage";
import {AppConfig} from "./utils/constants";
import {reset} from "./utils/NavigationUtil";

class Register extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      username: "",
      password: "",
      confirm_password: "",
      email: ""
    };
  }

  fetchRegister () {
    // create user
    const param = {
      user_name: this.state.username,
      password: this.state.password,
      confirm_password: this.state.confirm_password,
      email: this.state.email
    }

    request.post(Api.register,param).then(responseData => {
      if(responseData.status == "success") {
        Alert.alert('Tips', responseData.error_message, [
          {
            text: 'OK',
            onPress: () => {
              this.fetchLogin()
            }
          }
        ])
      }else{
        Alert.alert('Tips', responseData.error_message, [
          {
            text: 'OK',
            onPress: () => {

            }
          }
        ])
      }
    }).catch((error) => {
      console.log('err: ', error)
    })
  }

  fetchLogin () {

    let param  = {
      user_name: this.state.username,
      password: this.state.password
    }
    request.post(Api.login,param).then(responseData => {
      console.log(responseData)
      if(responseData.status == "success") {
        AsyncStorage.setItem('session_id', JSON.stringify(responseData.session_id))
        AppConfig.sessionId = responseData.session_id
        reset(this.props.navigation,'Main',{isNewUser:true})

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
        <Text allowFontScaling={false} style={{fontSize: 20, marginBottom: 40}}>Sign up or sign in to your account</Text>
        <View style={styles.textInputContainer}>
          <Text allowFontScaling={false}>Username</Text>
          <TextInput
            allowFontScaling={false}
            style={styles.textInput}
            placeholder=""
            clearButtonMode="while-editing"
            defaultValue={this.state.username}
            placeholderTextColor="#CCC"
            onChangeText={(username) => this.setState({ username })}
          />
        </View>
        <View style={styles.textInputContainer}>
          <Text allowFontScaling={false}>Email</Text>
          <TextInput
            allowFontScaling={false}
            style={styles.textInput}
            placeholder=""
            clearButtonMode="while-editing"
            defaultValue={this.state.email}
            placeholderTextColor="#CCC"
            onChangeText={(email) => this.setState({ email })}
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
        <View style={styles.textInputContainer}>
          <Text allowFontScaling={false}>Confirm Password</Text>
          <TextInput
            allowFontScaling={false}
            style={styles.textInput}
            placeholder=""
            clearButtonMode="while-editing"
            password={true}
            defaultValue={this.state.confirm_password}
            placeholderTextColor="#CCC"
            secureTextEntry
            onChangeText={(confirm_password) => this.setState({ confirm_password })}
          />
        </View>
        <View style={styles.textSubmitFoot}>
          <TouchableHighlight
            style={{backgroundColor: '#5e5e5e', padding: 10, borderRadius: 20}}
            onPress={() => {
              if (this.state.email.length > 0 && this.state.password.length > 0 && this.state.confirm_password.length > 0 && this.state.username.length > 0) {
                if (this.state.confirm_password == this.state.password) {
                  this.fetchRegister()
                } else {
                  Alert.alert('Tips', 'Wrong account or password!', [
                    {
                      text: 'OK',
                      onPress: () => {}
                    }
                  ])
                }
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
              }}>Register</Text>
            </>
          </TouchableHighlight>
        </View>
        <View style={{flex: 1, justifyContent: 'flex-end', marginBottom: 30}}>
          <TouchableHighlight
            underlayColor='transparent'
            onPress={() => {
              this.props.navigation.navigate('Login')
            }}
          >
            <Text allowFontScaling={false} style={{color: 'rgb(27, 140, 203)'}}>Login</Text>
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
    // justifyContent: 'space-around',
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
  containerLogo: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
    marginBottom: 20,
  },
  logo: {
    width: 60,
    height: 60,
    borderRadius: 10,
    marginBottom: 10
  },
  logoDec: {
    fontSize: 14
  },
}

module.exports = Register;
