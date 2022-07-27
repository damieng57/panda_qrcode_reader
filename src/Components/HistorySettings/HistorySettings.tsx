import {useAtom} from 'jotai';
import {AlertDialog, Button, Heading} from 'native-base';
import React from 'react';
import {useQrCodes} from '../../realm/Provider';
import {getTranslation as t} from '../../utils/helpers';
import {isAnonymAtom, openUrlAutoAtom} from '../../utils/atoms';
import {SettingsItem} from '../SettingsItem';

export const HistorySettings = () => {
  const [isAnonym, setIsAnonym] = useAtom(isAnonymAtom);
  const [openUrlAuto, setOpenUrlAuto] = useAtom(openUrlAutoAtom);
  const {deleteAll, clearFavorites} = useQrCodes();
  const [alert, setAlert] = React.useState({
    isOpen: false,
    title: '',
    description: '',
    type: '',
  });
  const cancelRef = React.useRef(null);

  const _clear = (type: string) => {
    if (type === 'FAVORITES') {
      clearFavorites();
    }
    if (type === 'HISTORY') {
      deleteAll();
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
    setIsAnonym();
  };

  const _setOpenUrlAuto = () => {
    setOpenUrlAuto();
  };

  return (
    <>
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
        onPress={_setOpenUrlAuto}
        title={t('settings_open_url_auto')}
        description={t('settings_open_url_auto_description')}
        isChecked={openUrlAuto}
        hasSwitch={true}
      />
      {/* End of set open url */}

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
    </>
  );
};
