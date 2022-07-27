import React from 'react';
import {Alert, Linking, Pressable, Share} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {IQrCode} from '../../types';
import fromUnixTime from 'date-fns/fromUnixTime';
import {format} from 'date-fns';
import {getTranslation as t} from '../../utils/helpers';
import {useNavigation} from '@react-navigation/native';
import {
  Text,
  HStack,
  VStack,
  Icon,
  IconButton,
  Menu,
  Checkbox,
  Box,
} from 'native-base';
import {ObjectId} from 'bson';
import {useAtom} from 'jotai';
import {accentColorAtom, isDeleteModeAtom} from '../../utils/atoms';

export interface IProps {
  item: IQrCode;
  onFavorite: (_id: ObjectId | string) => void;
  onDelete: (qrcode: IQrCode) => void;
  onMarkedToDelete: (_id: ObjectId | string) => void;
}

export const ITEM_HEIGHT = 58;

export const Item = React.memo((props: IProps) => {
  const [accentColor, setAccentColor] = useAtom(accentColorAtom);
  const [isDeleteMode, setIsDeleteMode] = useAtom(isDeleteModeAtom);
  const [shouldOverlapWithTrigger] = React.useState(false);
  const navigation = useNavigation();
  const {item} = props;

  if (!item) return null;

  const handleDelete = () => {
    props.onDelete(item);
  };

  const handleFavorite = () => {
    props.onFavorite(props.item._id);
  };

  const handleMarkedToDelete = () => {
    props.onMarkedToDelete(props.item._id);
  };

  const handlePress = async () => {
    if (isDeleteMode) {
      setIsDeleteMode();
      return;
    }

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

  const handleLongPress = async () => {
    console.log('longpress');
    if (!isDeleteMode) {
      props.onMarkedToDelete(props.item._id);
    }
  };

  React.useEffect(() => {
    if (!isDeleteMode && props.item.markedToDelete) {
      setIsDeleteMode();
    }
  }, [props.item.markedToDelete]);

  const handleShare = async () => {
    try {
      await Share.share({
        message: item.data,
      });
    } catch (error) {
      Alert.alert(error?.message);
    }
  };

  const additionalStyle = item.favorite
    ? {
        borderColor: 'gray.400',
      }
    : {
        borderColor: 'transparent',
      };

  return (
    // For HStack, we use style to be sure tht the height corresponding to the layout
    <>
      <HStack
        alignItems="center"
        mr="3"
        borderLeftWidth={3}
        {...additionalStyle}>
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
          <Pressable onPress={handlePress} onLongPress={handleLongPress}>
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
          </Pressable>
        </VStack>

        {isDeleteMode ? (
          <Checkbox
            isChecked={props.item.markedToDelete}
            accessible={true}
            accessibilityLabel="Select to delete"
            accessibilityRole="checkbox"
            onChange={handleMarkedToDelete}
            value="delete"
            colorScheme={accentColor.split('.')[0]}
            size="md"
            mr={2}
            borderRadius="999px"
            icon={
              <Icon
                as={
                  <Box bg="white" borderRadius="999px" p={1}>
                    <Box flex={1} bg={accentColor} borderRadius="999px" />
                  </Box>
                }
              />
            }
          />
        ) : (
          <Menu
            shouldOverlapWithTrigger={shouldOverlapWithTrigger}
            mr={3}
            // @ts-ignore
            trigger={triggerProps => {
              return (
                <IconButton
                  icon={
                    <Icon
                      size="sm"
                      as={<MaterialCommunityIcons name="dots-vertical" />}
                    />
                  }
                  {...triggerProps}
                />
              );
            }}>
            <Menu.Item onPress={handlePress}>
              {t('action.view_details')}
            </Menu.Item>
            <Menu.Item onPress={handleFavorite}>
              {item.favorite
                ? t('action.remove_from_favorites')
                : t('action.add_to_favorites')}
            </Menu.Item>
            <Menu.Item onPress={handleShare}>{t('action.share')}</Menu.Item>
            {/* <Menu.Item onPress={() => console.log('Customize')}>Personnaliser</Menu.Item>
        <Menu.Item onPress={() => console.log('Pin/Unpin')}>Epingler/Retirer</Menu.Item> */}
            <Menu.Item onPress={handleDelete}>{t('action.delete')}</Menu.Item>
          </Menu>
        )}
      </HStack>
    </>
  );
});
