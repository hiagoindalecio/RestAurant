import { StatusBar, useColorScheme } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Colors } from 'react-native/Libraries/NewAppScreen';

import Routes from './src/routes';

import * as Font from 'expo-font';

export default function App() {
  const isDarkMode = useColorScheme() === 'dark';
  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };
  const [fontsLoaded, setFontsLoaded] = useState(false);
  
  useEffect(() => {
    (async () => {
      await Font.loadAsync({
        'RobotoMedium': require('./src/assets/fonts/Roboto-Medium.ttf'),
        'SatisfyRegular': require('./src/assets/fonts/Satisfy-Regular.ttf'),
      });
      setFontsLoaded(true);
    })();
  }, []);  

  if (!fontsLoaded)
    return null;

  return (
    <>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
        translucent
      />
      <Routes />
    </>
  );
}