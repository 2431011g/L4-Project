import React from 'react';
import {Alert, DeviceEventEmitter, Text, TextInput, TouchableHighlight, View,} from 'react-native';
import {AppConfig} from "./utils/constants";

class Category extends React.Component {
  constructor(props) {
    super(props);

    const routeParams = this.props.route.params
    console.log('routeParams', routeParams);

    this.state = {
      params: routeParams,
      tag_name: "",
      session_id: AppConfig.sessionId
    };

  }

  componentWillUnmount() {
    DeviceEventEmitter.emit('Change')
  }

  fetchData () {
    fetch(`http://175.24.183.174:8080/task/category/add`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'session_id': this.state.session_id
      },
      body: JSON.stringify({
        tag_name: this.state.tag_name
      })
    })
    .then(response => response.json())
    .then(responseData => {
      console.log(responseData)
      if(responseData.status == "success") {
        this.props.navigation.goBack()
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

  fetchDataCategoryUpdate (old_tag) {
    fetch(`http://175.24.183.174:8080/task/category/update`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'session_id': this.state.session_id
      },
      body: JSON.stringify({
        old_tag: this.state.params.old_tag,
        new_tag: this.state.tag_name
      })
    })
    .then(response => response.json())
    .then(responseData => {
      console.log(responseData)
      if(responseData.status == "success") {
        Alert.alert('Tips', responseData.error_message, [
          {
            text: 'OK',
            onPress: () => this.props.navigation.goBack()
          }
        ])

      }
    })
    .catch((error) => {
      console.log('err: ', error)
    })
  }

  render() {
    if (this.state.params && this.state.params.old_tag) {
      return (
        <View style={styles.container}>
          <View style={styles.textInputContainer}>
            <TextInput
              allowFontScaling={false}
              style={styles.textInput}
              placeholder=""
              clearButtonMode="while-editing"
              defaultValue={this.state.params.old_tag}
              placeholderTextColor="#CCC"
              multiline={false}
              editable={true}
            />
          </View>
          <View style={styles.textInputContainer}>
            <TextInput
              allowFontScaling={false}
              style={styles.textInput}
              placeholder="New Tag"
              clearButtonMode="while-editing"
              defaultValue={this.state.tag_name}
              placeholderTextColor="#CCC"
              multiline={false}
              onChangeText={(tag_name) => this.setState({ tag_name })}
            />
          </View>
          <View style={styles.textSubmitFoot}>
            <TouchableHighlight
              style={{backgroundColor: '#5e5e5e', padding: 10, borderRadius: 20}}
              onPress={() => {
                if (this.state.tag_name.length > 0) {
                  this.fetchDataCategoryUpdate()
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
                }}>Update</Text>
              </>
            </TouchableHighlight>
          </View>
        </View>
      );
    } else {
      return (
        <View style={styles.container}>
          <View style={styles.textInputContainer}>
            <TextInput
              allowFontScaling={false}
              style={styles.textInput}
              placeholder=""
              clearButtonMode="while-editing"
              defaultValue={this.state.tag_name}
              placeholderTextColor="#CCC"
              multiline={false}
              onChangeText={(tag_name) => this.setState({ tag_name })}
            />
          </View>
          <View style={styles.textSubmitFoot}>
            <TouchableHighlight
              style={{backgroundColor: '#5e5e5e', padding: 10, borderRadius: 20}}
              onPress={() => {
                if (this.state.tag_name.length > 0) {
                  this.fetchData()
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
                }}>Sumbit</Text>
              </>
            </TouchableHighlight>
          </View>
        </View>
      );
    }
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
    paddingTop: 15,
    paddingBottom: 15,
    marginTop: 10,
    fontWeight: '700',
    borderRadius: 0,
    textAlign: 'left',
    height: 50,
    color: '#111',
    textAlign: 'left',
    flexDirection: 'row',
    justifyContent: 'space-between'
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
  task_status: {width: 15, height: 15, marginRight: 5},
}

module.exports = Category;
