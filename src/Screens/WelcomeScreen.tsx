import * as React from 'react';
import {ScrollView, Box, Image, Center, Button} from 'native-base';
import {Dimensions} from 'react-native';
import {settingsAtom} from '../utils/helpers';
import { useAtom } from 'jotai';

export const WelcomeScreen = () => {
  const [settings, setSettings] = useAtom(settingsAtom);
  const WIDTH = Dimensions.get('window').width;

  return (
    <ScrollView horizontal pagingEnabled>
      <>
        <Box bg={'amber.500'} width={WIDTH}>
          <Center flex={1}>
            <Image
              source={require('../assets/qr-code-icon.png')}
              alt={'app icon'}
              size="lg"
              resizeMode="cover"
              m={3}
            />
          </Center>
          <Button
            marginBottom={20}
            marginX={32}
            borderRadius={'999px'}
            height={12}
            onPress={() => console.log('nextpage')}>
            Bienvenue
          </Button>
        </Box>
        <Box bg={'blue.500'} width={WIDTH}>
          <Center flex={1}>
            <Image
              source={require('../assets/qr-code-icon.png')}
              alt={'app icon'}
              size="lg"
              resizeMode="cover"
              m={3}
            />
          </Center>
          <Button
            marginBottom={20}
            marginX={32}
            borderRadius={'999px'}
            height={12}
            onPress={() => console.log('nextpage')}>
            Suivant
          </Button>
        </Box>
        <Box bg={'green.500'} width={WIDTH}>
          <Center flex={1}>
            <Image
              source={require('../assets/qr-code-icon.png')}
              alt={'app icon'}
              size="lg"
              resizeMode="cover"
              m={3}
            />
          </Center>
          <Button
            marginBottom={20}
            marginX={32}
            borderRadius={'999px'}
            height={12}
            onPress={() =>
              setSettings({
                ...settings,
                welcomeScreen: false,
              })
            }>
            Terminer
          </Button>
        </Box>
      </>
    </ScrollView>
  );
};
