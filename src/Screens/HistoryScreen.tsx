import * as React from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {ITEM_HEIGHT, Item} from '../Components/Item';
import {getTranslation as t, settingsAtom} from '../utils/helpers';
import {useQrCodes} from '../realm/Provider';
import {
  HStack,
  IconButton,
  Icon,
  Divider,
  Input,
  FlatList,
  Box,
  useColorModeValue,
} from 'native-base';
import {useAtom} from 'jotai';

export const HistoryScreen = () => {
  const {qrCodes, filterQrCodes, deleteQrCode, updateQrCode} = useQrCodes();
  const [settings, setSettings] = useAtom(settingsAtom);

  const _onChangeSearch = (search: string) =>
    setSettings({
      ...settings,
      criteria: search,
    });

  const _renderItem = (data: any) => {
    return (
      <Item
        item={data.item}
        onFavorite={updateQrCode}
        onDelete={deleteQrCode}
      />
    );
  };

  React.useEffect(() => {
    filterQrCodes(settings.criteria, settings.showFavorites);
  }, [settings.criteria, settings.showFavorites, qrCodes.length]);

  return (
    <Box flex="1" bg={useColorModeValue('warmGray.50', 'coolGray.800')}>
      {/* Searchbar */}
      <HStack p={3}>
        <Input
          flex="1"
          placeholder={t('search_placeholder')}
          onChangeText={_onChangeSearch}
          value={settings.criteria}
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
          InputRightElement={
            <Icon
              mr="3"
              size="5"
              color="gray.400"
              as={<MaterialCommunityIcons name="close" />}
              onPress={() =>
                setSettings({
                  ...settings,
                  criteria: '',
                })
              }
            />
          }
        />
        <HStack alignItems="center">
          <IconButton
            marginLeft={2}
            icon={
              <Icon
                as={
                  <MaterialCommunityIcons
                    name={settings.showFavorites ? 'star' : 'star-outline'}
                  />
                }
                size="sm"
              />
            }
            onPress={() =>
              setSettings({
                ...settings,
                showFavorites: !settings.showFavorites,
              })
            }
          />
        </HStack>
      </HStack>
      {/* End of searchbar */}

      <FlatList
        keyExtractor={(_item, index) => index.toString()}
        renderItem={data => _renderItem(data)}
        data={qrCodes}
        getItemLayout={(data, index) => ({
          length: ITEM_HEIGHT,
          offset: ITEM_HEIGHT * index,
          index,
        })}
        ItemSeparatorComponent={() => <Divider />}
      />
    </Box>
  );
};
