import React, { Component } from 'react';
import {Alert, FlatList, Linking, Share, StyleSheet, View} from 'react-native'

class Drawer extends Component {
    render() {
        return (
             <>
        <SwipeRow leftOpenValue={100} rightOpenValue={-50}>
          <View style={styles.standaloneRowBack}>
            <View style={{flexDirection: 'row'}}>
              <IconButton
                style={{backgroundColor: theme.colors.primary}}
                icon={item.item.favorite ? 'star' : 'star-outline'}
                onPress={_isFavorites}></IconButton>
              <IconButton
                style={{backgroundColor: theme.colors.primary}}
                icon="share-variant"
                onPress={_isShared}></IconButton>
            </View>
            <View>
              <IconButton
                icon="delete"
                onPress={_isDeleted}
                style={{backgroundColor: theme.colors.error}}></IconButton>
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
                  name={isFavorites ? 'star-outline' : 'star'}
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
    }
}

export default Drawer;