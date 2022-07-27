import {atom} from 'jotai';
import {
  getBackgroundColor,
  updateBackgroundColor,
  updateAccentColor,
  updateIsDarkMode,
  updateIsAnonym,
  updateIsDeleteMode,
  updateOpenUrlAuto,
  updateCriteria,
  updateShowFavorites,
  updateNumberOfFavorites,
  updateNumberOfItemsMarkedToDeletion,
} from './reducers';
import {storeAtom} from './store';

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
  (get, set, param) => set(storeAtom, updateCriteria(get(storeAtom), param)),
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
