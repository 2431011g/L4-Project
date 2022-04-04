// In Root.js in a new project

import * as React from 'react';
import { View, Text, Button, Image, TouchableHighlight } from 'react-native';
import { NavigationContainer,useNavigation } from '@react-navigation/native';
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
import Category from './Category';
import Feedbacks from './Feedback';
import Icons from './Icons';
import WebQuestionnaire from './Web';
import {useEffect} from "react";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const LocationStack = createNativeStackNavigator();
function LocationStackScreen() {
  return (
    <LocationStack.Navigator>
      <Tab.Screen name="Location" component={LocationLogs} />
      <Stack.Screen name="Map" component={Map} />
    </LocationStack.Navigator>
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

const WebStack = createNativeStackNavigator();
function WebStackScreen() {
  return (
    <MyStack.Navigator>
      <Stack.Screen name="WebQuestionnaire" component={WebQuestionnaire} />
    </MyStack.Navigator>
  )
}

const Main = (props)=>{

    const navigation = useNavigation()
    const routeParam = props.route.params

    // console.log('main param',routeParam)

    useEffect(()=>{
        if(routeParam && routeParam.isNewUser){
            navigation.navigate('Questionnaire')
        }

    },[])


    return (
        <Tab.Navigator screenOptions={({ route }) => ({
            headerShown: false,
            tabBarIcon: ({ focused, color, size }) => {
                let iconName;

                if (route.name === 'Home') {
                    return <Image resizeMode='cover' style={{width: 30, height: 30}} source={{uri: !focused ? Icons.icon1 : Icons.icon1}} />
                }

                // if (route.name === 'Location') {
                //   return <Image resizeMode='cover' style={{width: 30, height: 30}} source={{uri: !focused ? Icons.icon3 : Icons.icon3}} />
                // }

                // if (route.name === 'Questionnaire') {
                //   return <Image resizeMode='cover' style={{width: 30, height: 30}} source={{uri: !focused ? Icons.icon3 : Icons.icon3}} />
                // }

                if (route.name === 'Data') {
                    return <Image resizeMode='cover' style={{width: 30, height: 30}} source={{uri: !focused ? Icons.icon2 : Icons.icon2}} />
                }

                if (route.name === 'My') {
                    return <Image resizeMode='cover' style={{width: 30, height: 30}} source={{uri: !focused ? Icons.icon4 : Icons.icon4}} />
                }
            },
            tabBarActiveTintColor: '#000',
            tabBarInactiveTintColor: 'gray'
        })}>
            <Tab.Screen name="Home" component={Home}  />
            <Tab.Screen name="Data" component={Collected} options={{headerShown:true}} />
            {/*<Tab.Screen name="My" component={MyStackScreen} />*/}
        </Tab.Navigator>
    )
}

function Root() {
  return (
    <NavigationContainer
        initialRouteName={'Welcome'}
        // screenOptions={screenOptions}
        mode={'card'}
    >

        <Stack.Navigator>

            <Stack.Screen name="Welcome" component={Welcome} options={{headerShown:false}}  />
            <Stack.Screen name="Main" component={Main} options={{headerShown:false}} />
            <Stack.Screen name="Login" component={Login} screenOptions={{
                headerBackTitle: false
            }} />
            <Stack.Screen name="Register" component={Register} />
            <Stack.Screen name="Map" component={Map} />
            <Stack.Screen name="Add" component={Add} />
            <Stack.Screen name="Category" component={Category} />
            <Stack.Screen name="Task" component={Task} />
            <Stack.Screen name="TaskList" component={TaskList} />
            <Stack.Screen name="Questionnaire" component={WebQuestionnaire} />
            <Stack.Screen name="Collected" component={Collected} />
            <Stack.Screen name="Feedbacks" component={Feedbacks} />
        </Stack.Navigator>

    </NavigationContainer>
  );
}

export default Root;
