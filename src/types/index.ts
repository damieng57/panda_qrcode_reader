import {ObjectId} from 'bson';

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
