import {
  DefaultTheme as NavigationDefaultTheme,
  DarkTheme as NavigationDarkTheme,
} from '@react-navigation/native';
import {
  DefaultTheme as PaperDefautTheme,
  DarkTheme as PaperDarkTheme,
} from 'react-native-paper';
import {useColorScheme} from 'react-native';

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
          },
        }
      : {
          ...PaperDefautTheme,
          ...NavigationDefaultTheme,
          colors: {
            ...PaperDefautTheme.colors,
            ...NavigationDefaultTheme.colors,
            accent: NavigationDefaultTheme.colors.primary,
          },
        };

  return theme;
};
