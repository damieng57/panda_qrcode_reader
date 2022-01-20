import {useAtom} from 'jotai';
import {Heading} from 'native-base';
import React from 'react';
import {defaultConfig, getTranslation as t} from '../../utils/helpers';
import {storeAtom} from '../../utils/store';
import {SettingsItem} from '../SettingsItem';

export const ApplicationSettings = () => {
  const [, setStore] = useAtom(storeAtom);
  return (
    <>
      <Heading size={'xs'} p={3}>
        {t('app_settings_title')}
      </Heading>
      <SettingsItem
        onPress={() => {
          setStore({...defaultConfig});
        }}
        title={t('settings_init')}
        description={t('settings_init_description')}
        hasSwitch={false}
      />
    </>
  );
};
