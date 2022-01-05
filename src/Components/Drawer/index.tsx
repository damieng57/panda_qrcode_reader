import React from 'react';
import {Linking} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {IQrCode} from '../../types';
import fromUnixTime from 'date-fns/fromUnixTime';
import {format} from 'date-fns';
import {getTranslation as t} from '../../utils/helpers';
import {useNavigation} from '@react-navigation/native';
import {Text, HStack, VStack, Icon} from 'native-base';

export interface IProps {
  item: IQrCode;
  isFavorites: () => void;
  isDeleted: () => void;
}

export const ITEM_HEIGHT = 64;

export const DrawerFront = React.memo((props: IProps) => {
  const navigation = useNavigation();
  const {item} = props;
  if (!item) return null;

  const _handlePress = async () => {
    // Checking if the link is supported for links with custom URL scheme.
    const supported = await Linking.canOpenURL(item.data);

    try {
      if (supported) {
        // Opening the link with some app, if the URL scheme is "http" the web link should be opened
        // by some browser in the mobile
        await Linking.openURL(item.data);
      } else {
        navigation.navigate('details', item);
      }
    } catch (error) {
      console.warn(error);
    }
  };

  return (
    <HStack alignItems='center' minHeight={ITEM_HEIGHT/4}>
      <Icon
        m="2"
        ml="3"
        size="6"
        color="gray.400"
        as={
          <MaterialCommunityIcons
            name={item.decoration ? item.decoration?.icon : 'link'}
          />
        }
      />

      <VStack flex="1" p="2">
        <Text bold noOfLines={1} isTruncated={true}>
          {item.decoration?.title}
        </Text>

        <HStack>
          <Text>{t(item.decoration?.text)} - </Text>
          <Text>{`${t('added')}`} </Text>
          <Text>{`${format(
            fromUnixTime(item.date / 1000),
            'dd/MM/yyyy',
          )}`}</Text>
        </HStack>
      </VStack>
    </HStack>
  );
});
