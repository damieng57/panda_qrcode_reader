import {Barcode} from 'react-native-camera';
import {URL} from 'react-native-url-polyfill';
import {getLocales} from 'react-native-localize';
import {atomWithStorage} from './atomWithStorage';
import {IQrCodeDecoration, ISettings, IQrCode} from '../types';
import uuid from 'react-native-uuid';
import {Atom, atom} from 'jotai';

// Jotai Store
export const historyAtom = atomWithStorage<IQrCode[]>('QRCODE:HISTORY', []);
export const favoritesAtom = atomWithStorage<IQrCode[]>('QRCODE:FAVORITES', []);
export const settingsAtom = atomWithStorage<ISettings>('QRCODE:SETTINGS', {
  isAnonym: false,
  isDarkMode: 'dark',
  accentColor: undefined,
  maxItems: 100,
});

// export const historyAtom = atom<IQrCode[]>({ default: [] });
// export const favoritesAtom = atom<IQrCode[]>([]);
// export const settingsAtom = atom<ISettings>({
//   isAnonym: false,
//   isDarkMode: 'dark',
//   accentColor: undefined,
//   maxItems: 100,
// });

export const createQrCode = (element: Barcode, favorite: boolean): IQrCode => ({
  // uuid.v4 return a string without options
  // @ts-expect-error
  _id: uuid.v4(),
  date: Date.now(),
  data: element.data,
  favorite: favorite,
  decoration: parseData(element),
  qrcode: {},
});

const language = getLocales()[0].languageCode;
let translation = require(`../i18n/en.json`);
switch (language) {
  case 'fr':
    translation = require(`../i18n/fr.json`);
    break;
  default:
    translation = require(`../i18n/en.json`);
    break;
}

export const isValidHttpUrl = (string: string): boolean => {
  let url;
  try {
    url = new URL(string);
  } catch (_) {
    return false;
  }
  return true;
};

export const getTranslation = (key: string) => {
  return translation[key] || '';
};

export const parseData = (data: Barcode): IQrCodeDecoration | undefined => {
  if (!data.type) return;

  switch (data.type) {
    case 'EMAIL':
      return {
        icon: 'email',
        title: 'email',
      };
    case 'PHONE':
      return {
        icon: 'phone',
        title: 'phone',
      };
    case 'CALENDAR_EVENT':
      return {
        icon: 'calendar',
        title: 'calendar',
      };
    case 'DRIVER_LICENSE':
      return {
        icon: 'card-account-details-outline',
        title: 'driver-licence',
      };
    case 'GEO':
      return {
        icon: 'map-outline',
        title: 'map',
      };
    case 'SMS':
      return {
        icon: 'message-text-outline',
        title: 'message-text-outline',
      };
    case 'CONTACT_INFO':
      return {
        icon: 'card-account-details-outline',
        title: 'card-account-details-outline',
      };
    case 'WIFI':
      return {
        icon: 'wifi',
        title: 'wifi',
      };
    case 'TEXT':
      return {
        icon: 'text',
        title: 'text',
      };

    case 'ISBN':
      return {
        icon: 'isbn',
        title: 'isbn',
      };

    case 'PRODUCT':
      return {
        icon: 'product',
        title: 'product',
      };
    default:
      // Probably an URL or Other type not handle by default
      // with RNCamera
      return extractTypeFromData(data);
  }
};
function extractTypeFromData(item: Barcode): IQrCodeDecoration | undefined {
  if (typeof item.data !== 'string') return;
  const type = item.data.split(':')[0].toUpperCase();

  console.log(type);
  // TODO: images, music, video, pdf, text and more social network
  switch (type) {
    case 'BITCOIN':
      return {
        icon: 'bitcoin',
        title: 'bitcoin',
      };
    case 'LITECOIN':
      return {
        icon: 'bitcoin',
        title: 'bitcoin',
      };
    case 'HTTP':
    case 'HTTPS':
      const url = new URL(item.data);
      if (url.hostname.toLowerCase().includes('twitter'))
        return {
          icon: 'twitter',
          title: url.hostname,
          text: 'twitter-link',
        };
      if (url.hostname.toLowerCase().includes('facebook'))
        return {
          icon: 'facebook',
          title: url.hostname,
          text: 'facebook-link',
        };
      if (url.hostname.toLowerCase().includes('instagram'))
        return {
          icon: 'instagram',
          title: url.hostname,
          text: 'instagram-link',
        };
      if (url.hostname.toLowerCase().includes('pinterest'))
        return {
          icon: 'pinterest',
          title: url.hostname,
          text: 'pinterest-link',
        };
      if (url.hostname.toLowerCase().includes('linkedin'))
        return {
          icon: 'linkedin',
          title: url.hostname,
          text: 'linkedin-link',
        };
    default:
      return {
        icon: 'link',
        title: item.data,
        text: 'link',
      };
  }
}
