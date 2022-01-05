import * as React from 'react';
import {StyleSheet} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import SplashScreen from 'react-native-splash-screen';
import {Provider} from 'jotai';
import {BottomMenu} from './Components/BottomMenu/BottomMenu';
import {DetailsScreen} from './Screens/DetailsScreen';
import {QrCodesProvider} from './realm/Provider';
import {NativeBaseProvider, extendTheme} from 'native-base';

// Define the config
const config = {
  useSystemColorMode: false,
  initialColorMode: 'dark',
};

const Stack = createStackNavigator();

export default function App() {
  const customTheme = extendTheme({config});

  React.useEffect(() => {
    SplashScreen.hide();
  });

  return (
    <Provider>
      <NativeBaseProvider theme={customTheme}>
        <NavigationContainer>
          <QrCodesProvider>
            <Stack.Navigator screenOptions={{header: () => null}}>
              <Stack.Screen name="main" component={BottomMenu} />
              <Stack.Screen name="details" component={DetailsScreen} />
            </Stack.Navigator>
          </QrCodesProvider>
        </NavigationContainer>
      </NativeBaseProvider>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  capture: {
    flex: 0,
    borderRadius: 5,
    padding: 15,
    paddingHorizontal: 20,
    alignSelf: 'center',
    margin: 20,
  },
});
