import AsyncStorage from '@react-native-community/async-storage';
import {WritableAtom} from 'jotai';
import {atomWithStorage, createJSONStorage} from 'jotai/utils';
import { IStore } from '../types';

export const defaultStore = {
  isAnonym: false,
  isDarkMode: 'light',
  accentColor: 'red.500',
  maxItems: 100,
  openUrlAuto: false,
  showFavorites: false,
  numberOfFavorites: 0,
  numberOfItemsMarkedToDeletion: 0,
  criteria: '',
  currentScreen: 0,
  welcomeScreen: true,
  isDeleteMode: false,
  backgroundColorDarkMode: '#1f2937',
  backgroundColorLightMode: '#fafaf9',
};

const defaultStorage = createJSONStorage(() => AsyncStorage);

// Jotai Store
export const storeAtom: WritableAtom<any, IStore, void | Promise<void>> =
  atomWithStorage('QRCODE:SETTINGS', defaultStore, defaultStorage);
