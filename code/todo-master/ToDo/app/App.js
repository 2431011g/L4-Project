// In Root.js in a new project

import * as React from 'react';
import { View, Text, Button, Image, TouchableHighlight } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import Map from './Map';
import Home from './Home';
import Login from './Login';
import Register from './Register';
import LocationLogs from './LocationLogs';
import Add from './Add';
import Task from './Task';
import TaskList from './TaskList';
import My from './My';
import Collected from './Collected';
import Welcome from './Welcome';
import Icons from './Icons';
import Root from './Root';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const HomeStack = createNativeStackNavigator();
class HomeStackScreen extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <HomeStack.Navigator>
        <Stack.Screen name="Welcome" component={Welcome} />
        <Stack.Screen name="Login" component={Login} screenOptions={{
          headerBackTitle: false
        }} />
        <Stack.Screen name="Home" component={Home} options={{
          headerRight: () => (
            <TouchableHighlight onPress={() => this.props.navigation.navigate('Add')} activeOpacity={0.9} underlayColor="none">
              <Image resizeMode='cover' style={{width: 30, height: 30}} source={{uri: Icons.plus}} />
            </TouchableHighlight>
          ),
        }} />
        <Stack.Screen name="Register" component={Register} />
        <Stack.Screen name="Map" component={Map} />
        <Stack.Screen name="Add" component={Add} />
        <Stack.Screen name="Task" component={Task} />
        <Stack.Screen name="TaskList" component={TaskList} />
      </HomeStack.Navigator>
    )
  }
}

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Welcome" component={Welcome} />
        <Stack.Screen name="Login" component={Login} screenOptions={{
          headerBackTitle: false
        }} />
        <Stack.Screen name="Register" component={Register} />
        <Stack.Screen name="Home" component={Root} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
