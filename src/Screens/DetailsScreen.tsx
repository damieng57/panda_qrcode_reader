import * as React from 'react';
import {ScrollView, ViewStyle} from 'react-native';
import {getTranslation as t} from '../utils/helpers';
import {HStack, Text, Box, useColorModeValue} from 'native-base';

export interface ITouchableColor {
  size?: number;
  color?: string;
  style?: ViewStyle;
  onPress: () => void;
}

export const DetailsScreen = (props: any) => {
  return (
    <Box flex="1" bg={useColorModeValue('warmGray.50', 'coolGray.800')}>
      {/* Header */}
      <HStack
        bg="#6200ee"
        px="1"
        py="3"
        justifyContent="space-between"
        alignItems="center">
        <HStack space="4" alignItems="center">
          <Text px="4" color="white" fontSize="20" fontWeight="bold">
            {t('header_title_history')}
          </Text>
        </HStack>
      </HStack>
      {/* End of Header */}
      <ScrollView
        style={{marginBottom: 50}}
        contentContainerStyle={{padding: 16}}>
        {/* TODO: Type must be dynamic */}
        <Text px="4" color="white" fontSize="28" fontWeight="bold">
          {t('details_type_title')} {props.route.params._type}
        </Text>

        <Text px="4" color="white" fontSize="16" fontWeight="bold">
          {props.route.params.data}
        </Text>
      </ScrollView>
    </Box>
  );
};
