import React, {Component} from 'react';
import {Linking, Share, StyleSheet, View} from 'react-native';
import {Divider, IconButton, List, Subheading} from 'react-native-paper';
import {SwipeRow} from 'react-native-swipe-list-view';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useTheme} from '../../theme';

const Drawer = (props: any) => {
  const theme = useTheme();
  const {isFavorites, isDeleted, item} = props;
  const [isFavorites2, setIsFavorites] = React.useState<boolean>();
  const {colors} = useTheme();

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

  const _isShared = async () => {
    try {
      const result = await Share.share({
        message: item.item.data,
      });
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <>
      <SwipeRow leftOpenValue={120} rightOpenValue={-60}>
        <View style={styles.standaloneRowBack}>
          <View style={{flexDirection: 'row'}}>
              <IconButton
                style={{backgroundColor: theme.colors.primary, borderRadius: 0, height: 80, width: 60, margin: 0}}
                icon={item.item.favorite ? 'star' : 'star-outline'}
                onPress={isFavorites}></IconButton>
            <IconButton
                style={{backgroundColor: theme.colors.warning, borderRadius: 0, height: 80, width: 60, margin: 0}}
                icon="share-variant"
              onPress={_isShared}></IconButton>
          </View>
          <View>
            <IconButton
              icon="delete"
              onPress={isDeleted}
              style={{backgroundColor: theme.colors.error, borderRadius: 0, height: 80, width: 60, margin: 0}}
              ></IconButton>
          </View>
        </View>
        <List.Item
          style={[
            styles.standaloneRowFront,
            {backgroundColor: theme.colors.surface},
          ]}
          title={
            <Subheading style={{fontWeight: 'bold'}}>
              {item.item.title}
            </Subheading>
          }
          description={item.item.text}
          onPress={_handlePress}
          left={() => (
            <View style={styles.icon}>
              <MaterialCommunityIcons
                onPress={() => setIsFavorites(!isFavorites)}
                name={isFavorites2 ? 'star-outline' : 'star'}
                size={24}
                color={colors.text}
              />
            </View>
          )}
        />
      </SwipeRow>

      <Divider style={{backgroundColor: theme.colors.border}} />
    </>
  );
};

export default Drawer;

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
