import * as React from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {ITEM_HEIGHT, Item} from '../Components/Item/Item';
import {getTranslation as t} from '../utils/helpers';
import {useQrCodes} from '../realm/Provider';
import {
  FlatList,
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
  VStack,
  Badge,
  Fab,
} from 'native-base';
import {useAtom} from 'jotai';
import {
  accentColorAtom,
  backgroundColorAtom,
  criteriaAtom,
  isAnonymAtom,
  showFavoritesAtom,
} from '../utils/atoms';

export const HistoryScreen = () => {
  const {
    resultSet,
    getAll,
    getFavorites,
    updateOne,
    deleteOne,
  } = useQrCodes();
  
  const [criteria, setCriteria] = useAtom(criteriaAtom);
  const [backgroundColor] = useAtom(backgroundColorAtom);
  // const [isAnonym] = useAtom(isAnonymAtom);
  const [accentColor] = useAtom(accentColorAtom);
  const [showFavorites, setShowFavorites] = useAtom(showFavoritesAtom);

  const [numberOfFavorites, setNumberOfFavorites] = React.useState(0);
  const [showToGoTop, setShowToGoTop] = React.useState(false);

  const flatListRef = React.useRef<FlatList>(null);

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

  const _onChangeSearch = (search: string) => setCriteria(search);

  const _renderItem = (data: any) => {
    return (
      <Item
        item={data?.item}
        onFavorite={updateOne}
        onDelete={deleteOne}
        onMarkedToDelete={() => null}
      />
    );
  };

  const getItem = (data: any, index: number) => {
    return data[index];
  };

  React.useEffect(() => {
    if (showFavorites) {
      return getFavorites(criteria);
    }
    getAll(criteria);
  }, [criteria, showFavorites, numberOfFavorites, resultSet.length]);

  return (
    <Box flex="1" bg={backgroundColor}>
      {/* Searchbar */}
      <HStack p={3}>
        <Input
          flex="1"
          placeholder={t('search_placeholder')}
          onChangeText={_onChangeSearch}
          value={criteria}
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
              onPress={() => setCriteria('')}
            />
          }
        />
        <HStack alignItems="center">
          <VStack>
            {typeof numberOfFavorites === 'number' && (
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
                {numberOfFavorites}
              </Badge>
            )}
            <IconButton
              ml={2}
              mr={2}
              mt={2}
              icon={
                <Icon
                  as={
                    <MaterialCommunityIcons
                      name={showFavorites ? 'star' : 'star-outline'}
                    />
                  }
                  size="sm"
                />
              }
              onPress={() => setShowFavorites()}
            />
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
          bg={accentColor}
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
