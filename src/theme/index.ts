import {
  DefaultTheme as NavigationDefaultTheme,
  DarkTheme as NavigationDarkTheme,
} from '@react-navigation/native';
import {
  DefaultTheme as PaperDefautTheme,
  DarkTheme as PaperDarkTheme,
} from 'react-native-paper';
import {
  indigo300,
  orange300,
  grey800,
  grey100,
  grey300,
  grey500,
  grey700,
  red300,
  green300,
} from './colors';
import { useColorScheme } from 'react-native';

// used by default
const darkTheme = {
  ...PaperDarkTheme,
  ...NavigationDarkTheme,
  dark: true,
  roundness: 0,
  colors: {
    // react-navigation theme
    card: grey800,
    border: grey800,
    // React-native-paper theme
    accent: indigo300,
    surface: grey800,
    disabled: grey300,
    placeholder: grey300,
    backdrop: grey500, // background of modal
    onSurface: grey100,
    // Shared colors (navigation/paper)
    text: grey100,
    notification: indigo300,
    primary: indigo300,
    background: grey800,
    // Custom colors
    success: green300,
    warning: orange300,
    error: red300,
  },
};

const lightTheme = {
  ...PaperDefautTheme,
  ...NavigationDefaultTheme,
  dark: false,
  roundness: 0,
  colors: {
    // react-navigation theme
    card: grey100,
    border: grey100,
    // React-native-paper theme
    accent: indigo300,
    surface: grey100,
    disabled: grey700,
    placeholder: grey700,
    backdrop: grey500,
    onSurface: grey800,
    // Shared colors (navigation/paper)
    text: grey800,
    notification: indigo300,
    primary: indigo300,
    background: grey100,
    // Custom colors
    success: green300,
    warning: orange300,
    error: red300,  },
};

export const useTheme = () => {
  const scheme = useColorScheme();
  return scheme === 'dark' ? darkTheme : lightTheme
};
