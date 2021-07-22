import * as React from 'react';
import {
  View,
  StyleSheet,
  Linking,
  ScrollView,
  Image,
  TouchableOpacity,
} from 'react-native';
import {Paragraph, useTheme, Headline} from 'react-native-paper';
import {getTranslation as t} from '../utils/helpers';

interface AboutScreenProps {}

export const AboutScreen = (props: AboutScreenProps) => {
  const {colors} = useTheme();

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
    </>
  );
};

// <a href="https://www.vecteezy.com/free-vector/qr-code-icon">Qr Code Icon Vectors by Vecteezy</a>

export default AboutScreen;

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingTop: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
