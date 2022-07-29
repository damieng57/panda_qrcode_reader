import * as React from 'react';
import {Animated} from 'react-native';
import {getTranslation as t} from '../../utils/helpers';
import {useAtom} from 'jotai';
import {Heading, VStack, Text, Icon, IconButton, HStack} from 'native-base';
import {SettingsItem} from '../../Components/Settings/SettingsItem';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {ColorPicker} from '../../Components/ColorPicker/ColorPicker';
import {
  accentColorAtom,
  backgroundColorAtom,
  isDarkModeAtom,
} from '../../utils/atoms';

export const ThemeSettings = () => {
  const [backgroundColor, setBackgroundColor] = useAtom(backgroundColorAtom);
  const [isDarkMode, setIsDarkMode] = useAtom(isDarkModeAtom);
  const [accentColor, setAccentColor] = useAtom(accentColorAtom);

  const _heightAccentColor = React.useRef(new Animated.Value(0)).current;
  const _heightBackground = React.useRef(new Animated.Value(0)).current;
  const [isOpenAccentColor, setIsOpenAccentColor] = React.useState(true);

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
