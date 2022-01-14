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
} from 'native-base';
import {settingsAtom} from './utils/helpers';
import {colors} from './utils/colors';

const Stack = createStackNavigator();

const BaseApp = () => {
  const [settings, setSettings] = useAtom(settingsAtom);

  // Define the colorModeManager,
  const colorModeManager: StorageManager = {
    get: async () => (settings.isDarkMode === 'dark' ? 'dark' : 'light'),
    set: (value: ColorMode) =>
      setSettings({
        ...settings,
        isDarkMode: value === 'dark' ? 'dark' : 'light',
      }),
  };

  const baseColor = settings?.accentColor?.split('.')[0] || 'red';

  // Define the config
  const theme = extendTheme({
    colors: {
      // Add new colors
      // @ts-ignore
      primary: colors[baseColor],
    },
    config: {
      // Changing initialColorMode to 'dark'
      initialColorMode: settings.isDarkMode,
    },
  });

  return (
    <NativeBaseProvider theme={theme} colorModeManager={colorModeManager}>
      <NavigationContainer>
        <QrCodesProvider>
          <Stack.Navigator screenOptions={{header: () => null}}>
            <Stack.Screen name="main" component={BottomMenu} />
            <Stack.Screen name="details" component={DetailsScreen} />
          </Stack.Navigator>
        </QrCodesProvider>
      </NavigationContainer>
    </NativeBaseProvider>
  );
};

export default function App() {
  React.useEffect(() => {
    SplashScreen.hide();
  });

  return (
    <StoreProvider>
      <BaseApp />
    </StoreProvider>
  );
}
