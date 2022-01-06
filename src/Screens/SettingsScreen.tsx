import * as React from 'react';
import {ViewStyle} from 'react-native';
import {getTranslation as t, settingsAtom} from '../utils/helpers';
import {useAtom} from 'jotai';
import {useQrCodes} from '../realm/Provider';
import {
  AlertDialog,
  Box,
  Heading,
  ScrollView,
  useColorModeValue,
  Button,
} from 'native-base';
import {SettingsItem} from '../Components/SettingsItem';
import {AppBar} from '../Components/AppBar';

export interface ITouchableColor {
  size?: number;
  color?: string;
  style?: ViewStyle;
  onPress: () => void;
}

export const SettingsScreen = (props: any) => {
  const [settings, setSettings] = useAtom(settingsAtom);
  const [isAnonym, setAnonym] = React.useState(settings?.isAnonym || false);
  const [alert, setAlert] = React.useState({
    isOpen: false,
    title: '',
    description: '',
    type: '',
  });
  const [openUrlAuto, setOpenUrlAuto] = React.useState(
    settings?.openUrlAuto || false,
  );
  const [maxItems] = React.useState(100);
  const {deleteAllQrCodes, clearAllFavoritesQrCodes} = useQrCodes();
  const cancelRef = React.useRef(null);

  React.useEffect(() => {
    setSettings({
      ...settings,
      isAnonym,
      maxItems,
      openUrlAuto,
    });
  }, [isAnonym, maxItems, openUrlAuto]);

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
    setAnonym(!isAnonym);
  };

  return (
    <Box flex="1" bg={useColorModeValue('warmGray.50', 'coolGray.800')}>
      <AppBar title={t('bottom_menu_settings')} />

      <ScrollView>
        <Heading size={'xs'} p={3}>
          {t('history_settings_title')}
        </Heading>

        {/* Set anonymous mode */}
        <SettingsItem
          onPress={_setAnonymousMode}
          title={t('settings_anonym_mode')}
          description={t('settings_anonym_mode_description')}
          isChecked={isAnonym}
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
          onPress={() => setOpenUrlAuto(!openUrlAuto)}
          title={t('settings_open_url_auto')}
          description={t('settings_open_url_auto_description')}
          isChecked={openUrlAuto}
          hasSwitch={true}
        />
        {/* End of set open url */}
      </ScrollView>

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
                  _clear(alert.type);
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
