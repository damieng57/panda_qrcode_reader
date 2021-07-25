import * as React from 'react';
import {StyleSheet, Platform, StatusBar} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {Provider as PaperProvider} from 'react-native-paper';
import SplashScreen from 'react-native-splash-screen';
import {Provider} from 'jotai';
import {BottomMenu} from './Components/BottomMenu';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {useTheme} from './theme';
import {DetailsScreen} from './Screens/DetailsScreen';

const Stack = createStackNavigator();

export default function App() {
  React.useEffect(() => {
    SplashScreen.hide();
  });

  const theme = useTheme();

  return (
    <Provider>
      <PaperProvider theme={theme}>
        <NavigationContainer theme={theme}>
          {Platform.OS === 'ios' && <StatusBar barStyle="light-content" />}
          <SafeAreaProvider>
            <Stack.Navigator screenOptions={{header: () => null}}>
              <Stack.Screen name="main" component={BottomMenu} />
              <Stack.Screen name="details" component={DetailsScreen} />
            </Stack.Navigator>
          </SafeAreaProvider>
        </NavigationContainer>
      </PaperProvider>
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
