import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import Home from './pages/home';
import Map from './pages/map';

const AppStack = createStackNavigator();

const Routes = () => {
  return (
    <NavigationContainer>
      <AppStack.Navigator
        screenOptions={{
          cardStyle: {
            backgroundColor: '#f0f0f5'
          },
          headerShown: false
        }}>
        <AppStack.Screen name="Home" component={Home} />
        <AppStack.Screen name="Map" component={Map} />
      </AppStack.Navigator>
    </NavigationContainer>
  );
};

export default Routes;