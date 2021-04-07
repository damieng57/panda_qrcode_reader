import * as React from 'react';
import {View, StyleSheet} from 'react-native';
import {Appbar, Paragraph, Title, Subheading} from 'react-native-paper';
import {getTranslation} from '../Utils/helpers';

interface AboutScreenProps {}

export const AboutScreen = (props: AboutScreenProps) => {
  return (
    <>
      <Appbar.Header>
        <Appbar.BackAction
          onPress={() => props.navigation.navigate('Main')}></Appbar.BackAction>
        <Appbar.Content title="QRCode Manager"></Appbar.Content>
      </Appbar.Header>
      <View style={styles.container}>
        <Title>{getTranslation('header_title')}</Title>
        <Subheading style={{marginBottom: 16}}>
          {getTranslation('about_subtitle')}
        </Subheading>
        <Paragraph>{getTranslation('about_text_1')}</Paragraph>
      </View>
    </>
  );
};

export default AboutScreen;

const styles = StyleSheet.create({
  container: {
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
