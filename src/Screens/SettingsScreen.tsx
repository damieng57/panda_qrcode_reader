import * as React from 'react';
import {getTranslation as t} from '../utils/helpers';
import {useAtom} from 'jotai';
import {Box, ScrollView} from 'native-base';
import {AppBar} from '../Components/AppBar/AppBar';
import {ApplicationSettings} from '../Components/Settings/ApplicationSettings';
import {HistorySettings} from '../Components/Settings/HistorySettings';
import {ThemeSettings} from '../Components/Settings/ThemeSettings';
import {backgroundColorAtom} from '../utils/atoms';

export const SettingsScreen = () => {
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
