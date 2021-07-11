import * as React from 'react';
import {View, StyleSheet, Linking, ScrollView} from 'react-native';
import {Appbar, Paragraph, Subheading, useTheme} from 'react-native-paper';
import {getTranslation} from '../utils/helpers';
import {TouchableOpacity} from 'react-native-gesture-handler';

interface AboutScreenProps {}

export const AboutScreen = (props: AboutScreenProps) => {
  const {colors} = useTheme();

  return (
    <>
      <Appbar.Header>
        <Appbar.Content
          title={getTranslation('header_title')}
          subtitle={getTranslation('header_subtitle')}></Appbar.Content>
      </Appbar.Header>
      <ScrollView contentContainerStyle={styles.container}>
        <Subheading style={{marginBottom: 16}}>
          {getTranslation('about_subtitle')}
        </Subheading>
        <Paragraph>{getTranslation('about_text_1')}</Paragraph>
        <TouchableOpacity
          onPress={() =>
            Linking.openURL('https://paypal.me/damieng57').catch(e =>
              console.log(e),
            )
          }></TouchableOpacity>

        <View
          style={{
            marginTop: 20,
            width: '100%',
            justifyContent: 'flex-start',
          }}>
          <Paragraph>Do you like this logo?</Paragraph>
        </View>
      </ScrollView>
    </>
  );
};

// <a href="https://www.vecteezy.com/free-vector/qr-code-icon">Qr Code Icon Vectors by Vecteezy</a>

export default AboutScreen;

const styles = StyleSheet.create({
  container: {
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
