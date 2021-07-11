import React from 'react';
import {View} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useTheme} from '../theme';

type Props = {
  iconName: string;
  isCurrent?: boolean;
};

export const BottomMenuItem = ({iconName, isCurrent}: Props) => {
  const theme = useTheme();
  return (
    <View
      style={{
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <MaterialCommunityIcons
        name={iconName}
        size={32}
        style={{color: theme.colors.onSurface}}
      />
    </View>
  );
};
