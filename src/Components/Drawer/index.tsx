import React from 'react';
import {Alert, Linking, Share, StyleSheet, View} from 'react-native';
import {IconButton, List, Subheading, Text} from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useTheme} from '../../theme';
import {IQrCode} from '../../types';
import fromUnixTime from 'date-fns/fromUnixTime';
import {format} from 'date-fns';
import {getTranslation as t} from '../../utils/helpers';
import { useNavigation } from '@react-navigation/native';

export interface IProps {
  item: IQrCode;
  isFavorites: () => void;
  isDeleted: () => void;
}

export const ITEM_HEIGHT = 64;

export const DrawerFront = React.memo((props: IProps) => {
  const theme = useTheme();
  const navigation = useNavigation();
  const {item} = props;
  if (!item) return null;

  const _handlePress = async () => {
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

  return (
    <List.Item
      style={[
        styles.standaloneRowFront,
        {backgroundColor: theme.colors.surface},
      ]}
      title={
        <Subheading style={{fontWeight: 'bold', color: theme.colors.text}}>
          {item.decoration?.title}
        </Subheading>
      }
      right={() => (
        <View
          style={{
            justifyContent: 'center',
            marginHorizontal: 6,
          }}>
          <Text style={{opacity: 0.8, color: theme.colors.text}}>{`${t(
            'added',
          )}`}</Text>
          <Text style={{opacity: 0.8, color: theme.colors.text}}>
            {`${format(fromUnixTime(item.date / 1000), 'dd/MM/yyyy')}`}
          </Text>
        </View>
      )}
      description={() => (
        <Text style={{opacity: 0.8, color: theme.colors.text}}>
          {t(item.decoration?.text)}
        </Text>
      )}
      onPress={_handlePress}
      left={() => (
        <View style={styles.icon}>
          <MaterialCommunityIcons
            name={item.decoration ? item.decoration?.icon : 'link'}
            size={24}
            color={theme.colors.text}
          />
        </View>
      )}
    />
  );
});

export const DrawerBack = React.memo((props: IProps) => {
  const theme = useTheme();
  const {item, isFavorites, isDeleted} = props;
  if (!item) return null;

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
    <View style={styles.standaloneRowBack}>
      <View
        style={{
          flex: 1,
          flexDirection: 'row',
          backgroundColor: theme.colors.warning,
        }}>
        <IconButton
          style={[styles.favoriteIcon, {backgroundColor: theme.colors.primary}]}
          icon={item.favorite ? 'star' : 'star-outline'}
          onPress={isFavorites}></IconButton>
        <IconButton
          style={[styles.shareIcon, {backgroundColor: theme.colors.warning}]}
          icon="share-variant"
          onPress={_isShared}></IconButton>
      </View>
      <View
        style={{
          flex: 1,
          backgroundColor: theme.colors.error,
          flexDirection: 'row-reverse',
        }}>
        <IconButton
          icon="delete"
          onPress={isDeleted}
          style={[
            styles.deleteIcon,
            {backgroundColor: theme.colors.error},
          ]}></IconButton>
      </View>
    </View>
  );
});

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
    height: ITEM_HEIGHT,
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
