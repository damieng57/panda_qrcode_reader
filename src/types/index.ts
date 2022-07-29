import {ObjectId} from 'bson';

export enum EMessageCode {
  ERROR = 'error',
  WARNING = 'warning',
  INFO = 'info',
  SUCCESS = 'success',
}

export interface IStore {
  isAnonym: boolean;
  isDarkMode: string;
  maxItems: number;
  openUrlAuto: boolean;
  showFavorites: boolean;
  criteria?: string;
  isDeleteMode: boolean;
  accentColor: string;
  backgroundColorDarkMode: string;
  backgroundColorLightMode: string;
  numberOfFavorites: number;
  numberOfItemsMarkedToDeletion: number;
}

export interface IMessage {
  status?: string;
  message?: string;
  error: string;
}

export interface IResultSetData {
  resultSet: Realm.Results<Object> | Array<any>;
  length: number;
  error?: IMessage;
}
export interface IQrCodeContext {
  create: (rawQrCode: IQrCode) => void;
  get: (query: string, sortedByDate: boolean, ...params: any) => IResultSetData| undefined;
  getAll: (criteria: string) => IResultSetData | undefined;
  getFavorites: (criteria: string) => IResultSetData| undefined;
  getToDelete: () => IResultSetData | undefined;
  updateOne: (_id: ObjectId, params: Partial<IQrCode>) => void;
  deleteOne: (qrcode: IQrCode) => void;
  deleteAll: () => void;
  clearFavorites: () => void;
  setResultSet: (result: Object[]) => void;
  resultSet: Realm.Results<Object> | Object[];
}

export interface IColorVariant {
  [key: string]: string;
}
export interface IColors {
  [key: string]: IColorVariant;
}

export interface IQrCode {
  _id: ObjectId;
  type: string;
  _type: string;
  data: any;
  favorite: boolean;
  date: Date;
  decoration?: IQrCodeDecoration;
  qrCode?: string;
  markedToDelete: boolean;
}

export interface IQrCodeDecoration {
  title: string;
  icon: string;
  text?: string;
}
