import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import RouteName from './Routes';
import {TaskDetails, TaskList, TagList} from '../screens';

const Stack = createStackNavigator();

export function NavigationStack() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name={RouteName.TaskList} component={TaskList} />
        <Stack.Screen name={RouteName.TaskDetails} component={TaskDetails} />
        <Stack.Screen name={RouteName.TagList} component={TagList} />
        {/*<Stack.Screen*/}
        {/*  name={RouteName.WeatherDetailsScreen}*/}
        {/*  component={WeatherDetailsScreen}*/}
        {/*  options={{*/}
        {/*    title: '',*/}
        {/*  }}*/}
        {/*/>*/}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
