export interface ISettings {
  isAnonym: boolean;
  isDarkMode: string;
  accentColor?: string;
  maxItems: number;
}

export interface IQrCode {
  _id: string;
  data: any;
  favorite: boolean;
  date: number;
  decoration?: IQrCodeDecoration;
  qrcode: any;
}

export interface IQrCodeDecoration {
  title: string;
  icon: string;
  text?: string;
}

export interface IHistory {}
