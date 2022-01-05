import * as React from 'react';
import {Linking, TouchableOpacity} from 'react-native';
import {getTranslation as t} from '../utils/helpers';
import VersionInfo from 'react-native-version-info';
import {
  Heading,
  Text,
  ScrollView,
  VStack,
  Link,
  Image,
  Box,
  useColorModeValue,
} from 'native-base';

export const AboutScreen = () => {
  return (
    <Box flex="1" bg={useColorModeValue('warmGray.50', 'coolGray.800')}>
      <ScrollView>
      <Heading size={'xs'} p={3}>
          {t('bottom_menu_about').toUpperCase()}
        </Heading>
        <VStack flex="1" alignItems={'center'} p={6}>
          <Image
            source={require('../assets/qr-code-icon.png')}
            alt={'app icon'}
            size="lg"
            resizeMode="cover"
            m={3}
          />
          <Heading color="white" size={'xs'} m={3}>
            {t('about_subtitle')}
          </Heading>
          <Text>{t('about_text_1')}</Text>
          <TouchableOpacity
            onPress={() =>
              Linking.openURL('https://paypal.me/damieng57').catch(e =>
                console.log(e),
              )
            }>
            <Image
              source={require('../assets/paypal.png')}
              alt={'paypal image'}
              width={150}
              height={50}
              resizeMode="cover"
              m={3}
            />
          </TouchableOpacity>
          <VStack>
            <Text>{`${t('about_text_2')} `}</Text>
            <Link
              onPress={() =>
                Linking.openURL(`mailto:${t('link')}`).catch(e =>
                  console.log(e),
                )
              }>{`${t('link')}`}</Link>
          </VStack>
        </VStack>
      </ScrollView>
      <Text>{`Version: ${VersionInfo.appVersion} Build: ${VersionInfo.buildVersion}`}</Text>
    </Box>
  );
};

export default AboutScreen;
