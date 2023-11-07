import { ScrollView, StatusBar, View, useColorScheme } from 'react-native';
import React, { useEffect } from 'react';
import * as SplashScreen from 'expo-splash-screen'
import { Colors } from 'react-native/Libraries/NewAppScreen';

import { useFonts } from 'expo-font';
import { Roboto_500Medium } from '@expo-google-fonts/roboto';
import { Satisfy_400Regular } from '@expo-google-fonts/satisfy';

import Routes from './src/routes';

function App(): JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };
  const [fontsLoaded] = useFonts({
    Roboto_500Medium,
    Satisfy_400Regular
  });
  
  useEffect(() => {
    const showSplashScreen = async () => await SplashScreen.preventAutoHideAsync();
    showSplashScreen();
  }, []);

  useEffect(() => {
    const hideSplashScreen = async () => await SplashScreen.hideAsync();
    if (fontsLoaded ) hideSplashScreen();
  }, [fontsLoaded])

  if (!fontsLoaded) return <></>;

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

export default App;
