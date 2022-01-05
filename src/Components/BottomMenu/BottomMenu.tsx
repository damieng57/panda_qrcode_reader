import React from 'react';
import {
  createBottomTabNavigator,
  BottomTabBarProps,
} from '@react-navigation/bottom-tabs';
import {ScanScreen} from '../../Screens/ScanScreen';
import {HistoryScreen} from '../../Screens/HistoryScreen';
import {AboutScreen} from '../../Screens/AboutScreen';
import {SettingsScreen} from '../../Screens/SettingsScreen';
import {View} from 'react-native';
import { NativeMenu } from './NativeMenu';

export const BottomMenu = () => {
  const Tab = createBottomTabNavigator();
  return (
    <View style={{flex: 1, position: 'relative'}}>
      <Tab.Navigator
        tabBar={(props: BottomTabBarProps) => <NativeMenu {...props} />}>
        <Tab.Screen name="qrcode"component={ScanScreen} />
        <Tab.Screen name="history" component={HistoryScreen} />
        <Tab.Screen name="cog" component={SettingsScreen} />
        <Tab.Screen name="information" component={AboutScreen} />
      </Tab.Navigator>
    </View>
  );
};
