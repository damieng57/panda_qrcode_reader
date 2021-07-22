import {
  DefaultTheme as NavigationDefaultTheme,
  DarkTheme as NavigationDarkTheme,
} from '@react-navigation/native';
import {
  DefaultTheme as PaperDefautTheme,
  DarkTheme as PaperDarkTheme,
} from 'react-native-paper';
import {useColorScheme} from 'react-native';
import {colors} from './colors';

export const useTheme = () => {
  const colorScheme = useColorScheme();

  const theme =
    colorScheme === 'dark'
      ? {
          ...PaperDarkTheme,
          ...NavigationDarkTheme,
          colors: {
            ...PaperDarkTheme.colors,
            ...NavigationDarkTheme.colors,
            accent: NavigationDarkTheme.colors.primary,
            warning: colors.orange,
          },
        }
      : {
          ...PaperDefautTheme,
          ...NavigationDefaultTheme,
          colors: {
            ...PaperDefautTheme.colors,
            ...NavigationDefaultTheme.colors,
            accent: NavigationDefaultTheme.colors.primary,
            warning: colors.orange,
          },
        };

  return theme;
};
