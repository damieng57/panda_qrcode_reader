import AsyncStorage from '@react-native-community/async-storage';
import {useAtom} from 'jotai';
import * as React from 'react';
import {Alert, FlatList, Linking, Share, StyleSheet, View} from 'react-native';
import {
  Appbar,
  Divider,
  IconButton,
  List,
  Searchbar,
  Subheading,
  Surface,
} from 'react-native-paper';
import {SwipeRow} from 'react-native-swipe-list-view';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Drawer from '../Components/drawer';
import {useTheme} from '../theme';
import {getTranslation as t, historyAtom} from '../utils/helpers';

export const HistoryScreen = (props: any) => {
  const theme = useTheme();
  const [history, setHistory] = useAtom(historyAtom);
  const [isFavorites, setIsFavorites] = React.useState<boolean>();
  const [searchQuery, setSearchQuery] = React.useState('');
  const {colors} = useTheme();

  const _onChangeSearch = (search: string) => setSearchQuery(search);

  const _renderItem = (item, index) => {
    const _handlePress = async () => {
      // Checking if the link is supported for links with custom URL scheme.
      const supported = await Linking.canOpenURL(item.item.data);

      if (supported) {
        // Opening the link with some app, if the URL scheme is "http" the web link should be opened
        // by some browser in the mobile
        await Linking.openURL(item.item.data);
      } else {
        alert(`${item.item.data}`);
      }
    };

    const _isFavorites = () => {
      const objIndex = history.map(obj => {
        if (obj._id === item.item._id) {
          obj.favorite = !obj.favorite;
        }
        return obj;
      });
      setHistory(objIndex);
    };

    const _isShared = async () => {
      try {
        const result = await Share.share({
          message: item.item.data,
        });
      } catch (error) {
        alert(error.message);
      }
    };

    const _isDeleted = () => {
      Alert.alert(t('alert_delete_item'), t('alert_delete_item_message'), [
        {
          text: t('alert_cancel'),
          onPress: () => {},
        },
        {
          text: t('alert_ok'),
          onPress: () => {
            const objIndex = history.filter(obj => obj._id !== item.item._id);
            setHistory(objIndex);
          },
        },
      ]);
    };

    return <Drawer />;
  };

  const _delete = () => {
    Alert.alert(t('alert_delete_list'), t('alert_delete_list_message'), [
      {
        text: t('alert_cancel'),
        onPress: () => {},
      },
      {
        text: t('alert_ok'),
        onPress: () => {
          setHistory([]);
          AsyncStorage.multiRemove(['QRCODE_DG::HISTORY']);
        },
      },
    ]);
  };

  const _generateList = () => {
    let _temp = history;
    if (isFavorites) _temp = _temp.filter(item => item.favorite);
    if (searchQuery !== '')
      _temp = _temp.filter(item =>
        item.data.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    return _temp;
  };

  return (
    <>
      <Appbar.Header>
        <Appbar.Content title={t('header_title_history')}></Appbar.Content>
      </Appbar.Header>
      <Surface
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingHorizontal: 16,
          paddingVertical: 8,
        }}>
        <Searchbar
          style={{flex: 1}}
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
              onPress={() => setIsFavorites(!isFavorites)}
              name={isFavorites ? 'star-outline' : 'star'}
              size={24}
              color={colors.text}
            />
          </View>
        </View>
      </Surface>
      <FlatList
        keyExtractor={(_item, index) => index.toString()}
        renderItem={(item, index) => _renderItem(item, index)}
        data={_generateList()}
      />
    </>
  );
};

const styles = StyleSheet.create({
  icon: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 64,
    width: 36,
  },
  items: {
    // flexDirection: 'row',
    alignItems: 'center',
    // padding: 16,
    width: '100%',
    flexDirection: 'row-reverse',
    justifyContent: 'flex-end',
    padding: 8,
    paddingLeft: 56,
  },
  title: {fontSize: 12, color: 'lightgray', paddingHorizontal: 16},
  texts: {flex: 1, paddingLeft: 56, paddingRight: 16},
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  capture: {
    flex: 0,
    borderRadius: 5,
    padding: 15,
    paddingHorizontal: 20,
    alignSelf: 'center',
    margin: 20,
  },

  standalone: {
    marginTop: 30,
    marginBottom: 30,
  },
  standaloneRowFront: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  standaloneRowBack: {
    alignItems: 'center',
    // backgroundColor: '#8BC',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  backTextWhite: {
    color: '#FFF',
  },
});
