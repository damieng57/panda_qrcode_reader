import * as React from 'react';
import {
  View,
  StyleSheet,
  Linking,
  ScrollView,
  Image,
  TouchableOpacity,
} from 'react-native';
import {Paragraph, Headline, Text} from 'react-native-paper';
import {getTranslation as t} from '../utils/helpers';
import VersionInfo from 'react-native-version-info';

export const AboutScreen = () => {
  return (
    <>
      <ScrollView contentContainerStyle={styles.container}>
        <Image
          source={require('../assets/qr-code-icon.png')}
          style={{marginTop: 16, width: 100, height: 100}}
        />
        <Headline style={{marginVertical: 16}}>{t('about_subtitle')}</Headline>
        <Paragraph>{t('about_text_1')}</Paragraph>
        <TouchableOpacity
          onPress={() =>
            Linking.openURL('https://paypal.me/damieng57').catch(e =>
              console.log(e),
            )
          }>
          <Image
            source={require('../assets/paypal.png')}
            style={{marginVertical: 16, width: 200, height: 60}}
          />
        </TouchableOpacity>
        <View style={{flex: 1, flexDirection: 'row', flexWrap: 'wrap'}}>
          <Paragraph>
            {`${t('about_text_2')} `}
            <Paragraph
              style={{textDecorationLine: 'underline'}}
              onPress={() =>
                Linking.openURL(`mailto:${t('link')}`).catch(e =>
                  console.log(e),
                )
              }>{`${t('link')}`}</Paragraph>
          </Paragraph>
        </View>
      </ScrollView>
      <Text
        style={{
          marginBottom: 75,
          alignSelf: 'flex-end',
          marginRight: 5,
        }}>{`Version: ${VersionInfo.appVersion} Build: ${VersionInfo.buildVersion}`}</Text>
    </>
  );
};

export default AboutScreen;

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingTop: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
