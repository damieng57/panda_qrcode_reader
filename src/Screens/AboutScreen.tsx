import * as React from 'react';
import {getTranslation as t} from '../utils/helpers';
import VersionInfo from 'react-native-version-info';
import {Heading, Text, ScrollView, Link, Image, Box} from 'native-base';
import {AppBar} from '../Components/AppBar/AppBar';
import {Linking} from 'react-native';
import Emoji from 'react-native-emoji';
import {useAtom} from 'jotai';
import {backgroundColorAtom} from '../utils/atoms';

export const AboutScreen = () => {
  const [backgroundColor] = useAtom(backgroundColorAtom);

  return (
    <Box flex="1" bg={backgroundColor}>
      <AppBar title={t('bottom_menu_about')} />
      <ScrollView
        contentContainerStyle={{
          alignItems: 'center',
          paddingHorizontal: 16,
        }}>
        <Image
          source={require('../assets/qr-code-icon.png')}
          alt={'app icon'}
          size="lg"
          resizeMode="cover"
          m={3}
        />
        <Heading size={'xs'} mb={3}>
          {t('about_subtitle')}
        </Heading>
        <Text mx={2}>{t('about_text_1')}</Text>

        <Text mt={20}>
          {t('about_made_with')} <Emoji name="heart" /> {t('about_for')}{' '}
          <Emoji name="busts_in_silhouette" /> and <Emoji name="cat2" />
        </Text>
        <Link
          href={'https://paypal.me/damieng57'}
          isExternal
          _text={{
            color: 'blue.400',
          }}>
          <Image
            source={require('../assets/paypal.png')}
            alt={'paypal image'}
            width={150}
            height={50}
            resizeMode="cover"
            m={3}
          />
        </Link>
        <Text>
          {`${t('about_text_2')} `}
          <Text
            color={'blue.400'}
            underline={true}
            onPress={() =>
              Linking.openURL(`mailto:${t('link')}`).catch(e => console.log(e))
            }>{`${t('link')}`}</Text>
        </Text>
      </ScrollView>
      <Text
        marginLeft={
          2
        }>{`Version: ${VersionInfo.appVersion} Build: ${VersionInfo.buildVersion}`}</Text>
    </Box>
  );
};

export default AboutScreen;
