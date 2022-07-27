import {ObjectId} from 'bson';

export interface IStore {
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

export interface IQrCodeContext {
  create: (rawQrCode: IQrCode) => void,
  get: (query: string, sortedByDate: boolean, ...params: any) => void,
  getAll: (criteria: string) => void,
  getFavorites: (criteria: string) => void,
  getToDelete: () => void,
  updateOne: (_id: ObjectId, params: Partial<IQrCode>) => void,
  deleteOne: (qrcode: IQrCode) => void,
  deleteAll: () => void,
  clearFavorites: () => void,
  resultSet: Realm.Results<Object> | [],
}

export interface ISettings {
  isAnonym: boolean;
  isDarkMode: string;
  accentColor?: string;
  maxItems: number;
  openUrlAuto: boolean;
  showFavorites: boolean;
  numberOfFavorites: number;
  numberOfItemsMarkedToDeletion: number;
  criteria: string;
  currentScreen: number;
  welcomeScreen: boolean;
  isDeleteMode: boolean;
  backgroundColorDarkMode: string;
  backgroundColorLightMode: string;
}

export interface IQrCode {
  _id: string | ObjectId;
  type: string;
  _type: string;
  data: any;
  favorite: boolean;
  date: Date;
  decoration?: IQrCodeDecoration | string;
  qrCode?: string;
  markedToDelete: boolean;
}

export interface IQrCodeDecoration {
  title: string;
  icon: string;
  text?: string;
}
