import * as React from 'react';
import {Alert} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {ITEM_HEIGHT, DrawerBack, DrawerFront} from '../Components/Drawer';
import {useTheme} from '../theme';
import {getTranslation as t} from '../utils/helpers';
import {useQrCodes} from '../realm/Provider';
import {
  VStack,
  HStack,
  IconButton,
  Icon,
  Text,
  Divider,
  Input,
  FlatList
} from 'native-base';

export const HistoryScreen = () => {
  const theme = useTheme();
  const {qrCodes, filterQrCodes, deleteQrCode, updateQrCode} = useQrCodes();
  const [isFavorites, setIsFavorites] = React.useState<boolean>();
  const [searchQuery, setSearchQuery] = React.useState<string>('');

  const _onChangeSearch = (search: string) => setSearchQuery(search);
  const _handleChangeCurrentList = () => setIsFavorites(!isFavorites);

  const _renderItem = (data: any, color?: string) => {
    return <DrawerFront item={data.item} color={color} />;
  };

  const _renderHiddenItem = (data: any, color?: string) => {
    // Action to add or remove Item in the favorite list
    const _isFavorite = () => {
      // Update favorites in the list
      updateQrCode(data.item._id);
    };

    // Action when you press Delete in the Drawer
    const _isDeleted = () => {
      Alert.alert(t('alert_delete_item'), t('alert_delete_item_message'), [
        {
          text: t('alert_cancel'),
          onPress: () => {},
        },
        {
          text: t('alert_ok'),
          onPress: () => deleteQrCode(data.item),
        },
      ]);
    };

    return (
      <DrawerBack
        item={data.item}
        isFavorites={_isFavorite}
        isDeleted={_isDeleted}
        color={color}
      />
    );
  };

  React.useEffect(() => {
    filterQrCodes(searchQuery, isFavorites);
  }, [searchQuery, isFavorites]);

  return (
    <>
      <VStack>

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
          <HStack space="2">
            <IconButton
              icon={
                <Icon
                  as={
                    <MaterialCommunityIcons
                      name={isFavorites ? 'star' : 'star-outline'}
                    />
                  }
                  size="sm"
                  color="white"
                />
              }
            />
            <IconButton
              icon={
                <Icon
                  as={<MaterialCommunityIcons name="magnify" />}
                  color="white"
                  size="sm"
                />
              }
            />
            <IconButton
              icon={
                <Icon
                  as={<MaterialCommunityIcons name="dots" />}
                  size="sm"
                  color="white"
                />
              }
            />
          </HStack>
        </HStack>
        {/* End of Header */}

        {/* Searchbar */}
        <HStack>
          <VStack p="4" width="100%" space={5} alignItems="center">
            <Input
              placeholder={t('search_placeholder')}
              onChangeText={_onChangeSearch}
              value={searchQuery}
              borderRadius="50"
              py="3"
              px="1"
              fontSize="14"
              InputLeftElement={
                <Icon
                  m="2"
                  ml="3"
                  size="6"
                  color="gray.400"
                  as={<MaterialCommunityIcons name="magnify" />}
                />
              }
            />
          </VStack>
        </HStack>
        {/* End of searchbar */}
      </VStack>

      <FlatList
        style={{marginBottom: 60}}
        keyExtractor={(_item, index) => index.toString()}
        renderItem={(data, rowMap) => _renderItem(data)}
        data={qrCodes}
        getItemLayout={(data, index) => ({
          length: ITEM_HEIGHT,
          offset: ITEM_HEIGHT * index,
          index,
        })}
        ItemSeparatorComponent={() => (
          <Divider style={{backgroundColor: theme.colors.border}} />
        )}
      />
    </>
  );
};
