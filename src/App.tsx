import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import SplashScreen from 'react-native-splash-screen';
import {Provider as StoreProvider, useAtom} from 'jotai';
import {BottomMenu} from './Components/BottomMenu/BottomMenu';
import {DetailsScreen} from './Screens/DetailsScreen';
import {QrCodesProvider} from './realm/Provider';
import {NativeBaseProvider, extendTheme, StatusBar} from 'native-base';
import {
  colorModeManager,
  getColorAndVariantFromToken,
  getColorFromToken,
  getVariantColorFromToken,
} from './utils/colors';
import {ActivityIndicator, SafeAreaView} from 'react-native';
import changeNavigationBarColor from 'react-native-navigation-bar-color';
import {
  accentColorAtom,
  backgroundColorAtom,
  isDarkModeAtom,
} from './utils/atoms';

const Stack = createStackNavigator();

const BaseApp = () => {
  const [backgroundColor] = useAtom(backgroundColorAtom);
  const [isDarkMode, setIsDarkMode] = useAtom(isDarkModeAtom);
  const [accentColor] = useAtom(accentColorAtom);

  const statusBarColor =
    isDarkMode === 'dark' ? 'light-content' : 'dark-content';

  const baseColor = getColorAndVariantFromToken(accentColor);

  // Define the config
  const theme = extendTheme({
    colors: {
      // Add new colors
      primary: baseColor,
    },
    config: {
      // Changing initialColorMode to 'dark'
      initialColorMode: isDarkMode,
    },
  });

  const navigationBarIsReady = async () => {
    try {
      changeNavigationBarColor(
        getVariantColorFromToken(accentColor, '500'),
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
    <NativeBaseProvider
      theme={theme}
      colorModeManager={colorModeManager(isDarkMode, setIsDarkMode)}>
      <SafeAreaView
        style={{flex: 1, backgroundColor: getColorFromToken(accentColor)}}>
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
      </SafeAreaView>
    </NativeBaseProvider>
  );
};

export default function App() {
  return (
    <React.Suspense
      fallback={
        <SafeAreaView
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <ActivityIndicator />
        </SafeAreaView>
      }>
      <StoreProvider>
        <QrCodesProvider>
          <BaseApp />
        </QrCodesProvider>
      </StoreProvider>
    </React.Suspense>
  );
}
