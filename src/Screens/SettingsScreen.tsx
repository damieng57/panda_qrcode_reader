import * as React from 'react';
import {ViewStyle} from 'react-native';
import {getTranslation as t, settingsAtom} from '../utils/helpers';
import {useAtom} from 'jotai';
import {useQrCodes} from '../realm/Provider';
import {
  AlertDialog,
  Box,
  Heading,
  useColorModeValue,
  Button,
  useTheme,
  FlatList,
  VStack,
  Text,
  Icon,
  IconButton,
  Center,
} from 'native-base';
import {SettingsItem} from '../Components/SettingsItem';
import {AppBar} from '../Components/AppBar';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

export interface ITouchableColor {
  size?: number;
  color?: string;
  style?: ViewStyle;
  onPress: () => void;
}

const excludedColors = [
  'contrastThreshold',
  'white',
  'black',
  'lightText',
  'darkText',
  'warmGray',
  'trueGray',
  'dark',
  'gray',
  'danger',
  'error',
  'success',
  'warning',
  'muted',
  'info',
  'light',
  'primary',
  'secondary',
  'tertiary',
];

export const SettingsScreen = (props: any) => {
  const [settings, setSettings] = useAtom(settingsAtom);
  const {colors} = useTheme();

  const listThemeColors = Object.keys(colors).filter(
    (color: string) =>
      !excludedColors.find(excludedColor => color === excludedColor),
  );

  const {deleteAllQrCodes, clearAllFavoritesQrCodes} = useQrCodes();
  const [alert, setAlert] = React.useState({
    isOpen: false,
    title: '',
    description: '',
    type: '',
  });

  const cancelRef = React.useRef(null);

  const _clear = (type: string) => {
    if (type === 'FAVORITES') {
      clearAllFavoritesQrCodes();
    }
    if (type === 'HISTORY') {
      deleteAllQrCodes();
    }
  };

  const _clearFavorites = () => {
    setAlert({
      isOpen: true,
      title: t('alert_clear_favorites'),
      description: t('alert_clear_favorites_message'),
      type: 'FAVORITES',
    });
  };

  const _clearHistory = () => {
    setAlert({
      isOpen: true,
      title: t('alert_delete_list'),
      description: t('alert_delete_list_message'),
      type: 'HISTORY',
    });
  };

  const _setAnonymousMode = () => {
    setSettings({
      ...settings,
      isAnonym: !settings.isAnonym,
    });
  };

  const _setOpenUrlAuto = () => {
    setSettings({
      ...settings,
      openUrlAuto: !settings.openUrlAuto,
    });
  };

  const _setDarkMode = () => {
    setSettings({
      ...settings,
      isDarkMode: settings.isDarkMode === 'dark' ? 'light' : 'dark',
    });
  };

  const _setAccentColor = (accentColor: string) => {
    setSettings({
      ...settings,
      accentColor,
    });
  };

  return (
    <Box flex="1" bg={useColorModeValue('warmGray.50', 'coolGray.800')}>
      <AppBar title={t('bottom_menu_settings')} />

      <FlatList
        numColumns={5}
        data={listThemeColors}
        columnWrapperStyle={{
          paddingLeft: 32,
          paddingRight: 12,
        }}
        ListHeaderComponent={
          <>
            <Heading size={'xs'} p={3}>
              {t('history_settings_title')}
            </Heading>

            {/* Set anonymous mode */}
            <SettingsItem
              onPress={_setAnonymousMode}
              title={t('settings_anonym_mode')}
              description={t('settings_anonym_mode_description')}
              isChecked={settings.isAnonym}
              hasSwitch={true}
            />
            {/* End of set anonymous mode */}

            {/* Clear history */}
            <SettingsItem
              onPress={_clearHistory}
              title={t('settings_clear_history')}
              description={t('settings_clear_history_description')}
              hasSwitch={false}
            />
            {/* End of clear history */}

            {/* Clear favorites */}
            <SettingsItem
              onPress={_clearFavorites}
              title={t('settings_clear_favorites')}
              description={t('settings_clear_favorites_description')}
              hasSwitch={false}
            />
            {/* End of clear favorites */}

            {/* Set open url */}
            <SettingsItem
              onPress={_setOpenUrlAuto}
              title={t('settings_open_url_auto')}
              description={t('settings_open_url_auto_description')}
              isChecked={settings.openUrlAuto}
              hasSwitch={true}
            />
            {/* End of set open url */}

            <Heading size={'xs'} p={3}>
              {t('settings_theme_title')}
            </Heading>

            {/* Set theme (dark/light) */}
            <SettingsItem
              onPress={_setDarkMode}
              title={t('settings_dark_mode')}
              description={t('settings_dark_mode_description')}
              isChecked={settings.isDarkMode === 'dark'}
              hasSwitch={true}
            />
            {/* End of set theme (dark/light) */}

            <VStack flex={1} ml={12} mt={6} mb={4}>
              <Heading size={'xs'}>{t('settings_accent_color')}</Heading>
              <Text>{t('settings_accent_color_description')}</Text>
            </VStack>
          </>
        }
        keyExtractor={(item, index) => `Icon${index}`}
        renderItem={({item}) => (
          <Center flex={1} mb={2} >
            <IconButton
              flex={1}
              height={12}
              width={12}
              bg={`${item}.500`}
              borderRadius="999px"
              icon={
                settings.accentColor === `${item}.500` ? (
                  <Icon
                    alignSelf={'center'}
                    pt={1}
                    as={<MaterialCommunityIcons name={'check'} />}
                    size="sm"
                  />
                ) : (
                  <React.Fragment></React.Fragment>
                )
              }
              onPress={() => _setAccentColor(`${item}.500`)}
            />
          </Center>
        )}
      />

      <AlertDialog leastDestructiveRef={cancelRef} isOpen={alert.isOpen}>
        <AlertDialog.Content>
          <AlertDialog.Header>{alert.title}</AlertDialog.Header>
          <AlertDialog.Body>{alert.description}</AlertDialog.Body>
          <AlertDialog.Footer>
            <Button.Group space={2}>
              <Button
                variant="unstyled"
                colorScheme="coolGray"
                onPress={() => {
                  setAlert({
                    isOpen: false,
                    title: '',
                    description: '',
                    type: '',
                  });
                }}>
                {t('alert_cancel')}
              </Button>
              <Button
                colorScheme="danger"
                onPress={() => {
                  _clear(alert.type);
                  setAlert({
                    isOpen: false,
                    title: '',
                    description: '',
                    type: '',
                  });
                }}>
                {t('alert_ok')}
              </Button>
            </Button.Group>
          </AlertDialog.Footer>
        </AlertDialog.Content>
      </AlertDialog>
    </Box>
  );
};
