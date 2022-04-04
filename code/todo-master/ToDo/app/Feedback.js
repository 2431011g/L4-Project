import React from 'react';
import {Alert, DeviceEventEmitter, Text, TextInput, TouchableHighlight, View,} from 'react-native';
import request from "./utils/request";
import Api from "./utils/Api";

class Feedback extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      content: "",
    };


  }

  componentWillUnmount() {
    DeviceEventEmitter.emit('Change')
  }

  fetchData () {

    let param = {
      content: this.state.content
    }
    request.post(Api.feedback,param).then(responseData => {
      console.log(responseData)
      if(responseData.status == "success") {
        Alert.alert('Tips', 'Successful feedback.', [
          {
            text: 'OK',
            onPress: () => this.props.navigation.goBack()
          }
        ])
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
          <TextInput
            allowFontScaling={false}
            style={styles.textInput}
            placeholder=""
            clearButtonMode="while-editing"
            defaultValue={this.state.content}
            placeholderTextColor="#CCC"
            multiline={true}
            onChangeText={(content) => this.setState({ content })}
          />
        </View>
        <View style={styles.textSubmitFoot}>
          <TouchableHighlight
            style={{backgroundColor: '#5e5e5e', padding: 10, borderRadius: 20}}
            onPress={() => {
              if (this.state.content.length > 0) {
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

const styles = {
  container: {
    position: 'relative',
    flex: 1,
    alignItems: 'center',
    padding: 15,
    width: '100%',
    backgroundColor: '#FFF'
  },
  textInput: {
    width: '100%',
    borderColor: '#d3d6d9',
    borderWidth: 1,
    padding: 15,
    paddingTop: 15,
    paddingBottom: 15,
    fontWeight: '700',
    borderRadius: 0,
    height: 150,
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

module.exports = Feedback;
