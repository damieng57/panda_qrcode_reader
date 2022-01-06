import * as React from 'react';
import {ScrollView, ViewStyle} from 'react-native';
import {getTranslation as t} from '../utils/helpers';
import {Text, Box, useColorModeValue} from 'native-base';
import { AppBar } from '../Components/AppBar';

export interface ITouchableColor {
  size?: number;
  color?: string;
  style?: ViewStyle;
  onPress: () => void;
}

export const DetailsScreen = (props: any) => {
  return (
    <Box flex="1" bg={useColorModeValue('warmGray.50', 'coolGray.800')}>
      <AppBar title={t('header_title_details')} />

      <ScrollView
        style={{marginBottom: 50}}
        contentContainerStyle={{padding: 16}}>
        {/* TODO: Type must be dynamic */}
        <Text px="4" fontSize="28" fontWeight="bold">
          {t('details_type_title')} {props.route.params._type}
        </Text>

        <Text px="4" fontSize="16" fontWeight="bold">
          {props.route.params.data}
        </Text>
      </ScrollView>
    </Box>
  );
};
