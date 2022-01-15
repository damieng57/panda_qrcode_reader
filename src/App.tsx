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
import {defaultConfig, settingsAtom} from './utils/helpers';
import {colors} from './utils/colors';
import {ActivityIndicator, View} from 'react-native';
import changeNavigationBarColor from 'react-native-navigation-bar-color';

const Stack = createStackNavigator();

const BaseApp = () => {
  const [settings, setSettings] = useAtom(settingsAtom);
  const background = settings?.isDarkMode === 'dark' ? '#1f2937' : '#fafaf9';
  const statusBarColor =
    settings?.isDarkMode === 'dark' ? 'light-content' : 'dark-content';

  // Define the colorModeManager,
  const colorModeManager: StorageManager = {
    get: async () => (settings?.isDarkMode === 'dark' ? 'dark' : 'light'),
    set: (value: ColorMode) =>
      setSettings({
        ...settings,
        isDarkMode: value === 'dark' ? 'dark' : 'light',
      }),
  };

  const baseColor =
    settings?.accentColor?.split('.')[0] ||
    defaultConfig.accentColor.split('.')[0];

  // Define the config
  const theme = extendTheme({
    colors: {
      // Add new colors
      // @ts-ignore
      primary:
        colors[settings?.accentColor?.split('.')[0]] ||
        colors[defaultConfig.accentColor.split('.')[0]],
    },
    config: {
      // Changing initialColorMode to 'dark'
      initialColorMode: settings?.isDarkMode,
    },
  });

  const navigationBarIsReady = async () => {
    try {
      changeNavigationBarColor(
        colors[baseColor]['500'],
        settings?.isDarkMode === 'dark' ? false : true,
        false,
      );
    } catch (e) {
      console.error(e); // {failed: false}
    } finally {
      SplashScreen.hide();
    }
  };

  React.useEffect(() => {
    navigationBarIsReady();
  }, [settings?.accentColor, settings?.isDarkMode]);

  return (
    <NativeBaseProvider theme={theme} colorModeManager={colorModeManager}>
      <NavigationContainer>
        <QrCodesProvider>
          <>
            <StatusBar backgroundColor={background} barStyle={statusBarColor} />
            <Stack.Navigator
              screenOptions={{
                header: () => null,
              }}>
              <Stack.Screen name="main" component={BottomMenu} />
              <Stack.Screen name="details" component={DetailsScreen} />
            </Stack.Navigator>
          </>
        </QrCodesProvider>
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
        <BaseApp />
      </StoreProvider>
    </React.Suspense>
  );
}
