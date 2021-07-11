import * as React from 'react';
import {StyleSheet, FlatList, View, Share, Alert, Linking} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  Appbar,
  Surface,
  Searchbar,
  IconButton,
  Switch,
  List,
  Subheading,
  Divider,
} from 'react-native-paper';
import AsyncStorage from '@react-native-community/async-storage';
import {getTranslation} from '../utils/helpers';
import { useAtom } from 'jotai'
import { useTheme } from '../theme'
import { atomWithStorage } from '../hooks/useAsyncStorage'
 
const historyAtom = atomWithStorage('DG:HISTORY', [])


export const HistoryScreen = (props: any) => {
  const theme = useTheme()
  const [history, setHistory] = useAtom(historyAtom);
  const [isFavorites, setIsFavorites] = React.useState();
  const [searchQuery, setSearchQuery] = React.useState('');
  const {colors} = useTheme();

  const _onChangeSearch = () => console.log(search)

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
      // const objIndex = history.map(obj => {
      //   if (obj._id === item.item._id) {
      //     obj.favorite = !obj.favorite;
      //   }
      //   return obj;
      // });
      // globalState.setHistory(objIndex);
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
      Alert.alert(
        getTranslation('alert_delete_item'),
        getTranslation('alert_delete_item_message'),
        [
          {
            text: getTranslation('alert_cancel'),
            onPress: () => {},
          },
          {
            text: getTranslation('alert_ok'),
            onPress: () => {
              const objIndex = history.filter(
                obj => obj._id !== item.item._id,
              );
              setHistory(objIndex);
            },
          },
        ],
      );
    };

    return (
      <>
        <List.Item
          title={
            <Subheading style={{fontWeight: 'bold'}}>
              {item.item.title}
            </Subheading>
          }
          description={item.item.text}
          onPress={_handlePress}
          left={() => <List.Icon icon={item.item.icon}></List.Icon>}
          right={() => (
            <View style={{flex: 0, flexDirection: 'row', alignItems: 'center'}}>
              <IconButton
                icon={item.item.favorite ? 'star' : 'star-outline'}
                onPress={_isFavorites}></IconButton>
              <IconButton icon="share-variant" onPress={_isShared}></IconButton>
              <IconButton icon="delete" onPress={_isDeleted}></IconButton>
            </View>
          )}
        />
        <Divider />
      </>
    );
  };

  const _delete = () => {
    Alert.alert(
      getTranslation('alert_delete_list'),
      getTranslation('alert_delete_list_message'),
      [
        {
          text: getTranslation('alert_cancel'),
          onPress: () => {},
        },
        {
          text: getTranslation('alert_ok'),
          onPress: () => {
            setHistory([]);
            AsyncStorage.multiRemove(['QRCODE_DG::HISTORY']);
          },
        },
      ],
    );
  };

  const _generateList = () => {
    let _temp = history;
    // if (isFavorites) _temp = _temp.filter(item => item.favorite);
    // if (searchQuery !== '')
    //   _temp = _temp.filter(item =>
    //     item.data.toLowerCase().includes(searchQuery.toLowerCase()),
    //   );
    return _temp;
  };

  return (
    <>
      <Appbar.Header>
        <Appbar.Content title={getTranslation('header_title')}></Appbar.Content>
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
          placeholder={getTranslation('search_placeholder')}
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
            <MaterialCommunityIcons name="star" size={24} color={colors.text} />
          </View>
          <Switch
            onValueChange={() => setIsFavorites(!isFavorites)}
            value={isFavorites}
            theme={theme}
            ></Switch>
          <IconButton icon="delete" onPress={_delete}></IconButton>
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
});
