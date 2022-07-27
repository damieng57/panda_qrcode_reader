import { IStore } from "../types";
import { defaultStore } from "./store";

export const updateBackgroundColor = (
    state: IStore,
    color?: string,
  ): IStore => {
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
  
  export const updateIsAnonym = (state: IStore): IStore => {
    return {
      ...state,
      isAnonym: !state.isAnonym,
    };
  };
  
  export const updateIsDarkMode = (state: IStore, mode?: string): IStore => {
    return {
      ...state,
      isDarkMode: mode || state.isDarkMode === 'dark' ? 'light' : 'dark',
    };
  };
  
  export const updateIsDeleteMode = (
    state: IStore,
    value: boolean | undefined = undefined,
  ): IStore => {
    return {
      ...state,
      isDeleteMode: typeof value !== 'undefined' ? value : !state.isDeleteMode,
    };
  };
  
  export const updateAccentColor = (state: IStore, color: string): IStore => {
    return {
      ...state,
      accentColor: color,
    };
  };
  
  export const updateOpenUrlAuto = (state: IStore): IStore => {
    return {
      ...state,
      openUrlAuto: !state.openUrlAuto,
    };
  };
  
  export const updateCriteria = (state: IStore, criteria?: string): IStore => {
    return {
      ...state,
      criteria: criteria || '',
    };
  };
  
  export const updateShowFavorites = (state: IStore): IStore => {
    return {
      ...state,
      showFavorites: !state.showFavorites,
    };
  };
  
  export const updateNumberOfFavorites = (
    state: IStore,
    value: number,
  ): IStore => {
    return {
      ...state,
      numberOfFavorites: value,
    };
  };
  
  export const updateNumberOfItemsMarkedToDeletion = (
    state: IStore,
    value: number,
  ): IStore => {
    return {
      ...state,
      numberOfItemsMarkedToDeletion: value,
    };
  };
  
  export const getBackgroundColor = (state: IStore): string => {
    if (!state) {
      return defaultStore.backgroundColorDarkMode;
    }
    return state.isDarkMode === 'dark'
      ? state.backgroundColorDarkMode
      : state.backgroundColorLightMode;
  };
  