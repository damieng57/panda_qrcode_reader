import * as React from 'react';
import {ScrollView, ViewStyle} from 'react-native';
import {getTranslation as t} from '../utils/helpers';
import {Text, Box} from 'native-base';
import {AppBar} from '../Components/AppBar/AppBar';
import {useAtom} from 'jotai';
import {backgroundColorAtom} from '../utils/atoms';

export interface ITouchableColor {
  size?: number;
  color?: string;
  style?: ViewStyle;
  onPress: () => void;
}

export const DetailsScreen = (props: any) => {
  const [backgroundColor] = useAtom(backgroundColorAtom);

  return (
    <Box flex="1" bg={backgroundColor}>
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
