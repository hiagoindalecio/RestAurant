import { StatusBar, useColorScheme } from 'react-native';
import React from 'react';
import { Colors } from 'react-native/Libraries/NewAppScreen';

import Routes from './src/routes';

import useCachedResources from './src/hooks/useCachedResources';

function App(): JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };
  
  const [isLoadingComplete] = useCachedResources();

  if (!isLoadingComplete)
    return <></>;

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
