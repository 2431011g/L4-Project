import React from 'react';
import icons from './Icons';
import Moment from 'moment';
import {Alert, AsyncStorage, DeviceEventEmitter, Image, Text, TextInput, TouchableHighlight, View,} from 'react-native';

class Add extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      tag: '',
      task_name: "",
      task_date: Moment().format("YYYYMMDD"),
      session_id: null,
      category: [],
    };

    AsyncStorage.getItem('session_id')
    .then((response) => {
      this.setState({
        session_id: response
      })

      this.fetchCategoryList()
    })
  }

  componentWillUnmount() {
    DeviceEventEmitter.emit('Change')
  }

  fetchData () {
    fetch(`http://175.24.183.174:8080/task/add`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'session_id': this.state.session_id
      },
      body: JSON.stringify({
        task_name: this.state.task_name,
        task_date: this.state.task_date,
        tag: this.state.tag,
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

  fetchCategoryList () {
    fetch(`http://175.24.183.174:8080/task/category/list`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'session_id': this.state.session_id
      }
    })
    .then(response => response.json())
    .then(responseData => {
      console.log('fetchCategoryList', responseData.data);
      this.setState({
        category: responseData.data
      })
    })
    .catch((error) => {
      console.log('err: ', error)
    })
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.textInputContainer}>
          <Text allowFontScaling={false}>{this.state.task_date || ''}</Text>
          <TextInput
            allowFontScaling={false}
            style={styles.textInput}
            placeholder=""
            clearButtonMode="while-editing"
            defaultValue={this.state.task_name}
            placeholderTextColor="#CCC"
            multiline={true}
            onChangeText={(task_name) => this.setState({ task_name })}
          />
        </View>
        <View style={{flexDirection: 'row', justifyContent: 'space-between', width: '100%'}}>
          {
            this.state.category.map((item, key) => {
              return (
                <TouchableHighlight key={key} activeOpacity={0.9} underlayColor="none" onPress={() => this.setState({tag: item.tag.tag})}>
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Image resizeMode='cover' style={styles.task_status} source={{uri: this.state.tag == item.tag.tag ? icons.checked : icons.check}} />
                    <Text>{item.tag.tag}</Text>
                  </View>
                </TouchableHighlight>
              )
            })
          }
        </View>
        <View style={styles.textSubmitFoot}>
          <TouchableHighlight
            style={{backgroundColor: '#5e5e5e', padding: 10, borderRadius: 20}}
            onPress={() => {
              if (this.state.task_name.length > 0 && this.state.task_date.length > 0) {
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

module.exports = Add;
