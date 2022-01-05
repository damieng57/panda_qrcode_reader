import * as React from 'react';
import {ViewStyle, Alert} from 'react-native';
import {getTranslation as t, settingsAtom} from '../utils/helpers';
import {useAtom} from 'jotai';
import {useQrCodes} from '../realm/Provider';
import {Box, Heading, ScrollView, useColorModeValue} from 'native-base';
import {SettingsItem} from '../Components/SettingsItem';

export interface ITouchableColor {
  size?: number;
  color?: string;
  style?: ViewStyle;
  onPress: () => void;
}

export const SettingsScreen = (props: any) => {
  const [settings, setSettings] = useAtom(settingsAtom);
  const [isAnonym, setAnonym] = React.useState(settings?.isAnonym || false);
  const [openUrlAuto, setOpenUrlAuto] = React.useState(
    settings?.openUrlAuto || false,
  );
  const [maxItems] = React.useState(100);
  const {deleteAllQrCodes, deleteAllFavoritesQrCodes} = useQrCodes();

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
      deleteAllFavoritesQrCodes();
    }
    if (type === 'HISTORY') {
      deleteAllQrCodes();
    }
  };

  const _showAlert = (title: string, message: string, type: string) => {
    Alert.alert(title, message, [
      {
        text: t('alert_cancel'),
        onPress: () => {},
      },
      {
        text: t('alert_ok'),
        onPress: () => _clear(type),
      },
    ]);
  };

  const _clearFavorites = () => {
    _showAlert(
      t('alert_delete_favorites'),
      t('alert_delete_favorites_message'),
      'FAVORITES',
    );
  };

  const _clearHistory = () => {
    _showAlert(
      t('alert_delete_list'),
      t('alert_delete_list_message'),
      'HISTORY',
    );
  };

  const _setAnonymousMode = () => {
    setAnonym(!isAnonym);
  };

  return (
    <Box flex="1" bg={useColorModeValue('warmGray.50', 'coolGray.800')}>
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
          title={t('settings_clear_history')}
          description={t('settings_clear_history_description')}
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
    </Box>
  );
};
