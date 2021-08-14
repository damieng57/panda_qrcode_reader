import * as React from 'react';
import {ScrollView, StyleSheet, ViewStyle} from 'react-native';
import {Appbar, Title, Paragraph} from 'react-native-paper';
import {getTranslation as t} from '../utils/helpers';

import {useTheme} from '../theme';

export interface ITouchableColor {
  size?: number;
  color?: string;
  style?: ViewStyle;
  onPress: () => void;
}

export const DetailsScreen = (props: any) => {
  const theme = useTheme();

  console.log(props.route.params)

  return (
    <>
      <Appbar.Header>
        <Appbar.Content title={t('header_title_details')}></Appbar.Content>
      </Appbar.Header>
      <ScrollView
        style={{marginBottom: 50}}
        contentContainerStyle={{padding: 16}}>
        {/* TODO: Type must be dynamic */}
        <Title style={styles.title}>{t('details_type_title')} {props.route.params._type}</Title>

        <Paragraph>{props.route.params.data}</Paragraph>
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  items: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 16,
  },
  title: {fontSize: 12, color: 'lightgray'},
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  texts: {flex: 1, padding: 16, paddingLeft: 72, paddingRight: 16},
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
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  backTextWhite: {
    color: '#FFF',
  },
});
