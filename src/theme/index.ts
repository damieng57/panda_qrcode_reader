import {
  DefaultTheme as NavigationDefaultTheme,
  DarkTheme as NavigationDarkTheme,
} from '@react-navigation/native';
import {
  DefaultTheme as PaperDefautTheme,
  DarkTheme as PaperDarkTheme,
} from 'react-native-paper';
import {indigo300, orange300} from './colors';
import {settingsAtom} from '../utils/helpers';
import { useAtom } from 'jotai';
import { ISettings } from '../types';


export const useTheme = () => {
  const [settings] = useAtom<ISettings>(settingsAtom);

  const theme =
  settings?.isDarkMode === 'dark'
      ? {
          ...PaperDarkTheme,
          ...NavigationDarkTheme,
          colors: {
            ...PaperDarkTheme.colors,
            ...NavigationDarkTheme.colors,
            accent: indigo300,
            warning: orange300,
          },
        }
      : {
          ...PaperDefautTheme,
          ...NavigationDefaultTheme,
          colors: {
            ...PaperDefautTheme.colors,
            ...NavigationDefaultTheme.colors,
            accent: indigo300,
            warning: orange300,
          },
        };

  return theme;
};
