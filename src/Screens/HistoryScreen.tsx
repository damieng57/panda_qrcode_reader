import * as React from 'react';
import {Alert, View} from 'react-native';
import {Searchbar, Surface, Divider, Appbar} from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {ITEM_HEIGHT, DrawerBack, DrawerFront} from '../Components/Drawer';
import {useTheme} from '../theme';
import {getTranslation as t} from '../utils/helpers';
import {useQrCodes} from '../realm/Provider';
import {SwipeListView} from 'react-native-swipe-list-view';

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
      <Appbar.Header style={{backgroundColor: theme.colors.surface}}>
        <Appbar.Content title={t('header_title_history')}></Appbar.Content>
      </Appbar.Header>
      <Surface
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingHorizontal: 16,
          paddingVertical: 8,
          backgroundColor: theme.colors.surface,
        }}>
        <Searchbar
          style={{flex: 1, color: theme.colors.surface, borderRadius: 5}}
          placeholder={t('search_placeholder')}
          onChangeText={_onChangeSearch}
          value={searchQuery}
        />
        <View
          style={{flexDirection: 'row', alignItems: 'center', paddingLeft: 16}}>
          <View
            style={{
              height: 60,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <MaterialCommunityIcons
              onPress={_handleChangeCurrentList}
              name={isFavorites ? 'star' : 'star-outline'}
              size={24}
              color={theme.colors.onSurface}
            />
          </View>
        </View>
      </Surface>
      <SwipeListView
        leftOpenValue={120}
        stopLeftSwipe={180}
        rightOpenValue={-60}
        stopRightSwipe={-180}
        useFlatList={true}
        style={{marginBottom: 60}}
        keyExtractor={(_item, index) => index.toString()}
        renderItem={(data, rowMap) => _renderItem(data)}
        renderHiddenItem={(data, rowMap) => _renderHiddenItem(data)}
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
