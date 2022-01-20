import * as React from 'react';
import {Animated} from 'react-native';
import {getTranslation as t} from '../utils/helpers';
import {useAtom} from 'jotai';
import {
  Box,
  Heading,
  VStack,
  Text,
  Icon,
  IconButton,
  ScrollView,
  HStack,
} from 'native-base';
import {SettingsItem} from '../Components/SettingsItem';
import {AppBar} from '../Components/AppBar/AppBar';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {ApplicationSettings} from '../Components/ApplicationSettings/ApplicationSettings';
import {HistorySettings} from '../Components/HistorySettings/HistorySettings';
import {ColorPicker} from '../Components/ColorPicker/ColorPicker';
import {
  accentColorAtom,
  backgroundColorAtom,
  isDarkModeAtom,
} from '../utils/store';

const ThemeSettings = () => {
  const [backgroundColor, setBackgroundColor] = useAtom(backgroundColorAtom);
  const [isDarkMode, setIsDarkMode] = useAtom(isDarkModeAtom);
  const [accentColor, setAccentColor] = useAtom(accentColorAtom);

  const _heightAccentColor = React.useRef(new Animated.Value(0)).current;
  const _heightBackground = React.useRef(new Animated.Value(0)).current;
  const [isOpenAccentColor, setIsOpenAccentColor] = React.useState(true);
  const [isOpenBackgroundColor, setIsOpenBackgroundColor] =
    React.useState(true);

  const openColorPickerAccentColor = () => {
    Animated.timing(_heightAccentColor, {
      toValue: 0,
      duration: 1000,
      useNativeDriver: false,
    }).start(() => setIsOpenAccentColor(true));
  };

  const closeColorPickerAccentColor = () => {
    Animated.timing(_heightAccentColor, {
      toValue: 230,
      duration: 1000,
      useNativeDriver: false,
    }).start(() => setIsOpenAccentColor(false));
  };

  const openColorPickerBackground = () => {
    Animated.timing(_heightBackground, {
      toValue: 0,
      duration: 1000,
      useNativeDriver: false,
    }).start(() => setIsOpenBackgroundColor(true));
  };

  const closeColorPickerBackground = () => {
    Animated.timing(_heightBackground, {
      toValue: 230,
      duration: 1000,
      useNativeDriver: false,
    }).start(() => setIsOpenBackgroundColor(false));
  };

  const _setDarkMode = () => setIsDarkMode();

  const _setAccentColor = (color: string) => {
    setAccentColor(color);
  };

  const _setBackgroundColor = (color: string) => {
    setBackgroundColor(color);
  };

  return (
    <>
      <Heading size={'xs'} p={3}>
        {t('settings_theme_title')}
      </Heading>

      {/* Set theme (dark/light) */}
      <SettingsItem
        onPress={_setDarkMode}
        title={t('settings_dark_mode')}
        description={t('settings_dark_mode_description')}
        isChecked={isDarkMode === 'dark'}
        hasSwitch={true}
      />
      {/* End of set theme (dark/light) */}

      <HStack>
        <VStack flex={1} ml={12} mt={6} mb={4}>
          <Heading size={'xs'}>{t('settings_accent_color')}</Heading>
          <Text>{t('settings_accent_color_description')}</Text>
        </VStack>
        <IconButton
          style={{justifyContent: 'center'}}
          mr={6}
          borderRadius={'999px'}
          mt={5}
          mb={5}
          icon={
            <Icon
              as={<MaterialCommunityIcons size={8} name={'arrow-right'} />}
            />
          }
          onPress={() =>
            isOpenAccentColor
              ? closeColorPickerAccentColor()
              : openColorPickerAccentColor()
          }
        />
      </HStack>

      <Animated.View
        style={{
          overflow: 'hidden',
          height: _heightAccentColor,
        }}>
        <ColorPicker
          onPress={_setAccentColor}
          shade="500"
          selectedColor={accentColor}
        />
      </Animated.View>

      <HStack>
        <VStack flex={1} ml={12} mt={6} mb={4}>
          <Heading size={'xs'}>{t('settings_background_color')}</Heading>
          <Text>{t('settings_background_color_description')}</Text>
        </VStack>
        <IconButton
          style={{justifyContent: 'center'}}
          mr={6}
          borderRadius={'999px'}
          mt={5}
          mb={5}
          icon={
            <Icon
              as={<MaterialCommunityIcons size={8} name={'arrow-right'} />}
            />
          }
          onPress={() =>
            isOpenBackgroundColor
              ? closeColorPickerBackground()
              : openColorPickerBackground()
          }
        />
      </HStack>

      <Animated.View
        style={{
          overflow: 'hidden',
          height: _heightBackground,
        }}>
        <ColorPicker
          onPress={_setBackgroundColor}
          shade="100"
          selectedColor={backgroundColor}
        />
      </Animated.View>
    </>
  );
};

export const SettingsScreen = (props: any) => {
  const [backgroundColor] = useAtom(backgroundColorAtom);

  return (
    <Box flex="1" bg={backgroundColor}>
      <AppBar title={t('bottom_menu_settings')} />

      <ScrollView nestedScrollEnabled={true}>
        <HistorySettings />
        <ThemeSettings />
        <ApplicationSettings />
      </ScrollView>
    </Box>
  );
};
