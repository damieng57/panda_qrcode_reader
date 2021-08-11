import {ObjectId} from 'bson';

export interface ISettings {
  isAnonym: boolean;
  isDarkMode: string;
  accentColor?: string;
  maxItems: number;
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
}

export interface IQrCodeDecoration {
  title: string;
  icon: string;
  text?: string;
}
