import * as React from 'react';
import {StyleSheet} from 'react-native';
import {
  NavigationContainer,
  DarkTheme as NavigationDarkTheme,
} from '@react-navigation/native';
import {createMaterialBottomTabNavigator} from '@react-navigation/material-bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {HistoryScreen} from './Screens/HistoryScreen';
import {ScanScreen} from './Screens/ScanScreen';
import {AboutScreen} from './Screens/AboutScreen';
import {
  Provider as PaperProvider,
  DarkTheme as PaperDarkTheme,
} from 'react-native-paper';
import AsyncStorage from '@react-native-community/async-storage';
import {createStackNavigator} from '@react-navigation/stack';
import { QrCode } from './Objects/QrCode'
import { getTranslation } from './Utils/helpers'

const CombinedDarkTheme = {
  ...PaperDarkTheme,
  ...NavigationDarkTheme,
  colors: {...PaperDarkTheme.colors, ...NavigationDarkTheme.colors},
};

interface IQrCode {
    history: QrCode[],
    setHistory: (value: QrCode[]) => void,
}

const globalState: IQrCode = {
  history: [],
  setHistory: (value: QrCode[]) => {},
};

function MainNavigator() {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Scan"
        component={ScanScreen}
        options={{
          tabBarLabel: getTranslation('tab_scan'),
          tabBarIcon: ({color}) => (
            <MaterialCommunityIcons name="qrcode" color={color} size={26} />
          ),
        }}
      />
      <Tab.Screen
        name="History"
        component={HistoryScreen}
        options={{
          tabBarLabel: getTranslation('tab_history'),
          tabBarIcon: ({color}) => (
            <MaterialCommunityIcons name="history" color={color} size={26} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export const AppContext = React.createContext(globalState);

const Stack = createStackNavigator();
const Tab = createMaterialBottomTabNavigator();

export default function App() {
  const [history, setHistory] = React.useState();
  const value = {history, setHistory};

  // AsyncStorage.multiRemove(['QRCODE_DG::FAVORITES', 'QRCODE_DG::HISTORY']);

  React.useEffect(() => {
    AsyncStorage.getItem('QRCODE_DG::HISTORY')
      .then(value => {
        console.log(value);

        if (value) {
          setHistory(JSON.parse(value));
        }
      })
      .catch(e => console.log(e));
  }, []);

  React.useEffect(() => {
    if (history !== globalState.history) {
      AsyncStorage.setItem(
        'QRCODE_DG::HISTORY',
        JSON.stringify(history),
      ).catch(e => console.log(e));
    }
  }, [history]);

  return (
    <PaperProvider theme={CombinedDarkTheme}>
      <AppContext.Provider value={value}>
        <NavigationContainer theme={CombinedDarkTheme}>
          <Stack.Navigator>
            <Stack.Screen
              name="Main"
              component={MainNavigator}
              options={{
                header: () => null,
              }}
            />
            <Stack.Screen
              name="About"
              component={AboutScreen}
              options={{
                header: () => null,
              }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </AppContext.Provider>
    </PaperProvider>
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
