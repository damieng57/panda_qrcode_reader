import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import SplashScreen from 'react-native-splash-screen';
import {Provider as StoreProvider, useAtom} from 'jotai';
import {BottomMenu} from './Components/BottomMenu/BottomMenu';
import {DetailsScreen} from './Screens/DetailsScreen';
import {QrCodesProvider} from './realm/Provider';
import {
  NativeBaseProvider,
  extendTheme,
  StorageManager,
  ColorMode,
  StatusBar,
} from 'native-base';
import {colors} from './utils/colors';
import {ActivityIndicator, View} from 'react-native';
import changeNavigationBarColor from 'react-native-navigation-bar-color';
import {
  accentColorAtom,
  backgroundColorAtom,
  isDarkModeAtom,
} from './utils/store';
import {defaultConfig} from './utils/helpers';

const Stack = createStackNavigator();

const BaseApp = () => {
  const [backgroundColor] = useAtom(backgroundColorAtom);
  const [isDarkMode, setIsDarkMode] = useAtom(isDarkModeAtom);
  const [accentColor] = useAtom(accentColorAtom);

  const statusBarColor =
    isDarkMode === 'dark' ? 'light-content' : 'dark-content';

  // Define the colorModeManager,
  const colorModeManager: StorageManager = {
    get: async () => (isDarkMode === 'dark' ? 'dark' : 'light'),
    set: (value: ColorMode) =>
      setIsDarkMode(value === 'dark' ? 'dark' : 'light'),
  };

  const baseColor =
    accentColor.split('.')[0] || defaultConfig.accentColor.split('.')[0];

  // Define the config
  const theme = extendTheme({
    colors: {
      // Add new colors
      // @ts-ignore
      primary:
        colors[accentColor.split('.')[0]] ||
        colors[defaultConfig.accentColor.split('.')[0]],
    },
    config: {
      // Changing initialColorMode to 'dark'
      initialColorMode: isDarkMode,
    },
  });

  const navigationBarIsReady = async () => {
    try {
      changeNavigationBarColor(
        colors[baseColor]['500'],
        isDarkMode === 'dark' ? false : true,
        false,
      );
    } catch (e) {
      if (__DEV__) {
        console.error(e);
      }
    } finally {
      SplashScreen.hide();
    }
  };

  React.useEffect(() => {
    navigationBarIsReady();
  }, [accentColor, isDarkMode]);

  return (
    <NativeBaseProvider theme={theme} colorModeManager={colorModeManager}>
      <NavigationContainer>
        <>
          <StatusBar
            backgroundColor={backgroundColor}
            barStyle={statusBarColor}
          />
          <Stack.Navigator
            screenOptions={{
              header: () => null,
            }}>
            <Stack.Screen name="main" component={BottomMenu} />
            <Stack.Screen name="details" component={DetailsScreen} />
          </Stack.Navigator>
        </>
      </NavigationContainer>
    </NativeBaseProvider>
  );
};

export default function App() {
  return (
    <React.Suspense
      fallback={
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <ActivityIndicator />
        </View>
      }>
      <StoreProvider>
        <QrCodesProvider>
          <BaseApp />
        </QrCodesProvider>
      </StoreProvider>
    </React.Suspense>
  );
}
