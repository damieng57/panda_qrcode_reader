import * as React from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {ITEM_HEIGHT, Item} from '../Components/Item/Item';
import {getTranslation as t, settingsAtom} from '../utils/helpers';
import {useQrCodes} from '../realm/Provider';
import {
  NativeScrollEvent,
  NativeSyntheticEvent,
  VirtualizedList,
} from 'react-native';
import {
  HStack,
  IconButton,
  Icon,
  Divider,
  Input,
  Box,
  useColorModeValue,
  VStack,
  Badge,
  Fab,
} from 'native-base';
import {useAtom} from 'jotai';

export const HistoryScreen = () => {
  const {
    resultSet,
    deleteQrCode,
    updateQrCode,
    getQrCodes,
    updateQrCodeToDelete,
    deleteAllMarkedQrCodes,
    clearAllMarkedToDeleteQrCodes,
  } = useQrCodes();
  const [settings, setSettings] = useAtom(settingsAtom);
  const [showToGoTop, setShowToGoTop] = React.useState(false);
  const flatListRef = React.useRef(null);

  const _showToGoTopButton = (
    event: NativeSyntheticEvent<NativeScrollEvent>,
  ) => {
    if (event.nativeEvent.contentOffset.y > 5 && !showToGoTop) {
      return setShowToGoTop(true);
    }

    if (event.nativeEvent.contentOffset.y <= 5 && showToGoTop) {
      return setShowToGoTop(false);
    }
  };

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
        onMarkedToDelete={updateQrCodeToDelete}
      />
    );
  };

  const getItem = (data: any, index: number) => {
    return data[index];
  };

  React.useEffect(() => {
    if (!settings) return;
    getQrCodes(settings?.criteria, settings?.showFavorites);
  }, [
    settings?.criteria,
    settings?.showFavorites,
    settings?.numberOfFavorites,
    settings?.isAnonym,
    resultSet.length,
  ]);

  React.useEffect(() => {
    if (
      settings?.numberOfItemsMarkedToDeletion === 0 ||
      settings?.numberOfItemsMarkedToDeletion === undefined
    ) {
      setSettings({
        ...settings,
        isDeleteMode: false,
      });
    } else {
      setSettings({
        ...settings,
        isDeleteMode: true,
      });
    }
  }, [settings?.numberOfItemsMarkedToDeletion]);

  React.useEffect(() => {
    if (settings?.isDeleteMode) {
      setSettings({
        ...settings,
        isDeleteMode: false,
      });
    }
    if (settings?.numberOfItemsMarkedToDeletion !== 0) {
      clearAllMarkedToDeleteQrCodes();
    }
  }, []);

  return (
    <Box flex="1" bg={useColorModeValue(settings?.backgroundColorDarkMode, settings?.backgroundColorLightMode)}>
      {/* Searchbar */}
      <HStack p={3}>
        <Input
          flex="1"
          placeholder={t('search_placeholder')}
          onChangeText={_onChangeSearch}
          value={settings?.criteria}
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
          <VStack>
            {!settings?.isDeleteMode &&
              typeof settings?.numberOfFavorites === 'number' && (
                <Badge
                  colorScheme="danger"
                  rounded="999px"
                  mb={-6}
                  mr={0}
                  zIndex={1}
                  variant="solid"
                  alignSelf="flex-end"
                  _text={{
                    fontSize: 12,
                  }}>
                  {settings?.numberOfFavorites}
                </Badge>
              )}
            {settings?.isDeleteMode ? (
              <IconButton
                ml={2}
                mr={2}
                mt={2}
                icon={
                  <Icon
                    as={<MaterialCommunityIcons name={'trash-can-outline'} />}
                    size="sm"
                  />
                }
                onPress={() => deleteAllMarkedQrCodes()}
              />
            ) : (
              <IconButton
                ml={2}
                mr={2}
                mt={2}
                icon={
                  <Icon
                    as={
                      <MaterialCommunityIcons
                        name={settings?.showFavorites ? 'star' : 'star-outline'}
                      />
                    }
                    size="sm"
                  />
                }
                onPress={() =>
                  setSettings({
                    ...settings,
                    showFavorites: !settings?.showFavorites,
                  })
                }
              />
            )}
          </VStack>
        </HStack>
      </HStack>
      {/* End of searchbar */}

      <VirtualizedList
        ref={flatListRef}
        keyExtractor={(_item, index) => index.toString()}
        onScroll={_showToGoTopButton}
        renderItem={data => _renderItem(data)}
        data={resultSet}
        getItemCount={data => data.length}
        getItem={getItem}
        getItemLayout={(data, index) => ({
          length: ITEM_HEIGHT,
          offset: ITEM_HEIGHT * index,
          index,
        })}
        ItemSeparatorComponent={() => <Divider />}
      />

      {showToGoTop && (
        <Fab
          bg={settings?.accentColor}
          position="absolute"
          bottom={'24'}
          size="sm"
          onPress={() =>
            flatListRef?.current?.scrollToIndex({
              animated: true,
              index: 0,
              viewPosition: 0,
            })
          }
          icon={
            <Icon
              color="white"
              as={<MaterialCommunityIcons name="arrow-up" />}
              size="sm"
            />
          }
        />
      )}
    </Box>
  );
};
