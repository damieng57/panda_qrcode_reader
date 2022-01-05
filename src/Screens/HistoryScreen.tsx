import * as React from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {ITEM_HEIGHT, DrawerFront} from '../Components/Drawer';
import {getTranslation as t} from '../utils/helpers';
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

export const HistoryScreen = () => {
  const {qrCodes, filterQrCodes, deleteQrCode, updateQrCode} = useQrCodes();
  const [isFavorites, setIsFavorites] = React.useState<boolean>();
  const [searchQuery, setSearchQuery] = React.useState<string>('');

  const _onChangeSearch = (search: string) => setSearchQuery(search);

  const _renderItem = (data: any, color?: string) => {
    return <DrawerFront item={data.item} color={color} />;
  };

  React.useEffect(() => {
    filterQrCodes(searchQuery, isFavorites);
  }, [searchQuery, isFavorites]);

  return (
    <Box flex="1" bg={useColorModeValue('warmGray.50', 'coolGray.800')}>
      {/* Searchbar */}
      <HStack p={3}>
        <Input
          flex="1"
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
          InputRightElement={
            <Icon
              mr="3"
              size="5"
              color="gray.500"
              as={<MaterialCommunityIcons name="close" />}
              onPress={() => setSearchQuery('')}
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
                    name={isFavorites ? 'star' : 'star-outline'}
                  />
                }
                size="sm"
              />
            }
          />
          <IconButton
            icon={
              <Icon
                as={<MaterialCommunityIcons name="dots-vertical" />}
                size="sm"
              />
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
