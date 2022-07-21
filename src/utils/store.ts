import AsyncStorage from '@react-native-community/async-storage';
import {atom, WritableAtom} from 'jotai';
import {atomWithStorage, createJSONStorage} from 'jotai/utils';

interface IStore {
  isAnonym: boolean;
  isDarkMode: string;
  maxItems: number;
  openUrlAuto: boolean;
  showFavorites: boolean;
  criteria: string;
  isDeleteMode: boolean;
  accentColor: string;
  backgroundColorDarkMode: string;
  backgroundColorLightMode: string;
  numberOfFavorites: number;
  numberOfItemsMarkedToDeletion: number;
}

export const defaultStore: IStore = {
  isAnonym: false,
  isDarkMode: 'light',
  maxItems: 100,
  openUrlAuto: false,
  showFavorites: false,
  criteria: '',
  isDeleteMode: false,
  accentColor: 'red.500',
  backgroundColorDarkMode: '#1f2937',
  backgroundColorLightMode: '#fafaf9',
  numberOfFavorites: 0,
  numberOfItemsMarkedToDeletion: 0,
};

type Storage<Value> = {
  getItem: (key: string) => Value | Promise<Value>;
  setItem: (key: string, newValue: Value) => void | Promise<void>;
  removeItem: (key: string) => void | Promise<void>;
};

const defaultStorage = createJSONStorage(() => AsyncStorage);

// Jotai Store
export const storeAtom: WritableAtom<any, IStore, void | Promise<void>> =
  atomWithStorage('QRCODE:SETTINGS', defaultStore, defaultStorage);

const updateBackgroundColor = (state: IStore, color?: string): IStore => {
  if (!state) {
    return defaultStore;
  }
  if (state?.isDarkMode === 'dark') {
    return {
      ...state,
      backgroundColorDarkMode: color || '#1f2937',
    };
  } else {
    return {
      ...state,
      backgroundColorLightMode: color || '#fafaf9',
    };
  }
};

const updateIsAnonym = (state: IStore): IStore => {
  return {
    ...state,
    isAnonym: !state.isAnonym,
  };
};

const updateIsDarkMode = (state: IStore, mode?: string): IStore => {
  return {
    ...state,
    isDarkMode: mode || state.isDarkMode === 'dark' ? 'light' : 'dark',
  };
};

const updateIsDeleteMode = (
  state: IStore,
  value: boolean | undefined = undefined,
): IStore => {
  return {
    ...state,
    isDeleteMode: typeof value !== 'undefined' ? value : !state.isDeleteMode,
  };
};

const updateAccentColor = (state: IStore, color: string): IStore => {
  return {
    ...state,
    accentColor: color,
  };
};

const updateOpenUrlAuto = (state: IStore): IStore => {
  return {
    ...state,
    openUrlAuto: !state.openUrlAuto,
  };
};

const updateCriteria = (state: IStore, criteria?: string): IStore => {
  return {
    ...state,
    criteria: criteria || '',
  };
};

const updateShowFavorites = (state: IStore): IStore => {
  return {
    ...state,
    showFavorites: !state.showFavorites,
  };
};

const updateNumberOfFavorites = (state: IStore, value: number): IStore => {
  return {
    ...state,
    numberOfFavorites: value,
  };
};

const updateNumberOfItemsMarkedToDeletion = (
  state: IStore,
  value: number,
): IStore => {
  return {
    ...state,
    numberOfItemsMarkedToDeletion: value,
  };
};

const getBackgroundColor = (state: IStore): string => {
  if (!state) {
    return defaultStore.backgroundColorDarkMode;
  }
  return state.isDarkMode === 'dark'
    ? state.backgroundColorDarkMode
    : state.backgroundColorLightMode;
};

export const backgroundColorAtom = atom<string, string>(
  get => getBackgroundColor(get(storeAtom)),
  (get, set, param: string) => {
    set(storeAtom, updateBackgroundColor(get(storeAtom), param));
  },
);

export const accentColorAtom = atom<string, string>(
  get => get(storeAtom).accentColor,
  (get, set, param: string) =>
    set(storeAtom, updateAccentColor(get(storeAtom), param)),
);

export const isDarkModeAtom = atom<string, string | undefined>(
  get => get(storeAtom).isDarkMode || true,
  (get, set, param) => set(storeAtom, updateIsDarkMode(get(storeAtom), param)),
);

export const isAnonymAtom = atom<boolean, void>(
  get => get(storeAtom).isAnonym,
  (get, set) => set(storeAtom, updateIsAnonym(get(storeAtom))),
);

export const isDeleteModeAtom = atom<boolean, boolean>(
  get => get(storeAtom).isDeleteMode,
  (get, set, param) =>
    set(storeAtom, updateIsDeleteMode(get(storeAtom), param)),
);

export const openUrlAutoAtom = atom<boolean, void>(
  get => get(storeAtom).openUrlAuto,
  (get, set) => set(storeAtom, updateOpenUrlAuto(get(storeAtom))),
);

export const criteriaAtom = atom<string, string>(
  get => get(storeAtom).criteria,
  (get, set) => set(storeAtom, updateCriteria(get(storeAtom))),
);

export const showFavoritesAtom = atom<boolean, void>(
  get => get(storeAtom).showFavorites,
  (get, set) => set(storeAtom, updateShowFavorites(get(storeAtom))),
);

export const numberOfFavoritesAtom = atom<number, number>(
  get => get(storeAtom).numberOfFavorites,
  (get, set, param) =>
    set(storeAtom, updateNumberOfFavorites(get(storeAtom), param)),
);

export const numberOfItemsMarkedToDeletionAtom = atom<number, number>(
  get => get(storeAtom).numberOfItemsMarkedToDeletion,
  (get, set, param) =>
    set(storeAtom, updateNumberOfItemsMarkedToDeletion(get(storeAtom), param)),
);
