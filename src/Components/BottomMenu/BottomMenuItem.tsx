import React from 'react';
import {View} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {indigo300} from '../../theme/colors'

type Props = {
  iconName: string;
  isCurrent?: boolean;
};

export const BottomMenuItem = ({iconName}: Props) => {
  return (
    <View
      style={{
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <MaterialCommunityIcons
        name={iconName}
        size={24}
        color={indigo300}
      />
    </View>
  );
};
