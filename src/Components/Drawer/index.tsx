import React from 'react';
import {Alert, Linking, Share, StyleSheet, View} from 'react-native';
import {IconButton, List, Subheading, Text} from 'react-native-paper';
import {SwipeRow} from 'react-native-swipe-list-view';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useTheme} from '../../theme';
import {IQrCode} from '../../types';
import fromUnixTime from 'date-fns/fromUnixTime';
import {getTranslation as t} from '../../utils/helpers';

export interface IProps {
  item: IQrCode;
  isFavorites: () => void;
  isDeleted: () => void;
}

export const ITEM_HEIGHT = 64;

const Drawer = React.memo((props: IProps) => {
  const theme = useTheme();
  const {item, isFavorites, isDeleted} = props;
  const {colors} = useTheme();
  if (!item) return null;

  const _handlePress = async () => {
    // Checking if the link is supported for links with custom URL scheme.
    const supported = await Linking.canOpenURL(item.data);

    if (supported) {
      // Opening the link with some app, if the URL scheme is "http" the web link should be opened
      // by some browser in the mobile
      await Linking.openURL(item.data);
    } else {
      Alert.alert(`${item.data}`);
    }
  };

  const _isShared = async () => {
    try {
      await Share.share({
        message: item.data,
      });
    } catch (error) {
      Alert.alert(error.message);
    }
  };

  return (
    <>
      <SwipeRow
        leftOpenValue={120}
        rightOpenValue={-60}
        style={{height: ITEM_HEIGHT}}>
        <View style={styles.standaloneRowBack}>
          <View style={{flexDirection: 'row', flex: 1}}>
            <IconButton
              style={[
                styles.favoriteIcon,
                {backgroundColor: theme.colors.primary},
              ]}
              icon={item.favorite ? 'star' : 'star-outline'}
              onPress={isFavorites}></IconButton>
            <IconButton
              style={[
                styles.shareIcon,
                {backgroundColor: theme.colors.warning},
              ]}
              icon="share-variant"
              onPress={_isShared}></IconButton>
          </View>
          <View>
            <IconButton
              icon="delete"
              onPress={isDeleted}
              style={[
                styles.deleteIcon,
                {backgroundColor: theme.colors.error},
              ]}></IconButton>
          </View>
        </View>
        <List.Item
          style={[
            styles.standaloneRowFront,
            {backgroundColor: theme.colors.surface},
          ]}
          title={
            <Subheading style={{fontWeight: 'bold'}}>
              {item.decoration?.title}{' '}
            </Subheading>
          }
          right={() => (
            <View
              style={{
                justifyContent: 'center',
                marginHorizontal: 6,
              }}>
              <Text style={{opacity: 0.8}}>{`${t('added')}`}</Text>
              <Text style={{opacity: 0.8}}>
                {`${fromUnixTime(item.date / 1000).toLocaleDateString()}`}
              </Text>
            </View>
          )}
          description={t(item.decoration?.text)}
          onPress={_handlePress}
          left={() => (
            <View style={styles.icon}>
              <MaterialCommunityIcons
                name={item.decoration ? item.decoration?.icon : 'link'}
                size={24}
                color={colors.text}
              />
            </View>
          )}
        />
      </SwipeRow>
    </>
  );
});

export default Drawer;

const styles = StyleSheet.create({
  icon: {
    justifyContent: 'center',
    alignItems: 'center',
    height: ITEM_HEIGHT,
    width: 36,
  },
  items: {
    alignItems: 'center',
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
    // alignItems: 'center',
    justifyContent: 'center',
    height: ITEM_HEIGHT,
  },
  standaloneRowBack: {
    alignItems: 'center',
    // flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  backTextWhite: {
    color: '#FFF',
  },
  favoriteIcon: {
    borderRadius: 0,
    height: ITEM_HEIGHT,
    width: 60,
    margin: 0,
  },
  shareIcon: {
    borderRadius: 0,
    height: ITEM_HEIGHT,
    width: 60,
    margin: 0,
  },
  deleteIcon: {
    borderRadius: 0,
    height: ITEM_HEIGHT,
    width: 60,
    margin: 0,
  },
});
