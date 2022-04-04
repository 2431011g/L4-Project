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

const LocationStack = createNativeStackNavigator();
function LocationStackScreen() {
  return (
    <LocationStack.Navigator>
      <Tab.Screen name="Location" component={LocationLogs} />
      <Stack.Screen name="Map" component={Map} />
    </LocationStack.Navigator>
  )
}

const CollectedStack = createNativeStackNavigator();
function CollectedStackScreen() {
  return (
    <CollectedStack.Navigator>
      <Stack.Screen name="Collected" component={Collected} />
    </CollectedStack.Navigator>
  )
}

const MyStack = createNativeStackNavigator();
function MyStackScreen() {
  return (
    <MyStack.Navigator>
      <Stack.Screen name="My" component={My} />
    </MyStack.Navigator>
  )
}

function Root() {
  return (
    <NavigationContainer>
      <Tab.Navigator screenOptions={({ route }) => ({
          headerShown: false,
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === 'Home') {
              return <Image resizeMode='cover' style={{width: 30, height: 30}} source={{uri: !focused ? Icons.icon1 : Icons.icon1}} />
            }

            if (route.name === 'Location') {
              return <Image resizeMode='cover' style={{width: 30, height: 30}} source={{uri: !focused ? Icons.icon2 : Icons.icon2}} />
            }

            if (route.name === 'Collected') {
              return <Image resizeMode='cover' style={{width: 30, height: 30}} source={{uri: !focused ? Icons.icon3 : Icons.icon3}} />
            }

            if (route.name === 'My') {
              return <Image resizeMode='cover' style={{width: 30, height: 30}} source={{uri: !focused ? Icons.icon4 : Icons.icon4}} />
            }
          },
          tabBarActiveTintColor: '#000',
          tabBarInactiveTintColor: 'gray',
        })}>
        <Tab.Screen name="Home" component={HomeStackScreen} />
        <Tab.Screen name="Location" component={LocationStackScreen} />
        <Tab.Screen name="Collected" component={CollectedStackScreen} />
        <Tab.Screen name="My" component={MyStackScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

export default Root;
