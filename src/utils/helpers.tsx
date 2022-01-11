import {Barcode} from 'react-native-camera';
import {URL} from 'react-native-url-polyfill';
import {getLocales} from 'react-native-localize';
import {atomWithStorage} from './atomWithStorage';
import {IQrCodeDecoration, ISettings, IQrCode} from '../types';
import {ObjectId} from 'bson'

// Jotai Store
export const settingsAtom = atomWithStorage<ISettings>('QRCODE:SETTINGS', {
  isAnonym: false,
  isDarkMode: 'dark',
  accentColor: undefined,
  maxItems: 100,
  openUrlAuto: false,
  showFavorites: false,
  criteria: '',
});

export const formatQrCode = (element: Barcode, favorite: boolean): IQrCode => ({
  _id: new ObjectId(),
  date: new Date(),
  type: element.type,
  _type: getInternalType(element),
  data: element.data,
  favorite: favorite,
  decoration: parseData(element),
  qrCode: '',
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

export const getTranslation = (key: string | undefined): string => {
  if (!key) return '';
  return translation[key];
};

export const getInternalType = (item: Barcode) => {
  const type = item.data.split(':');
  if (type[0].toUpperCase() === 'BEGIN') return type[1].toUpperCase();
  return type[0].toUpperCase();
};

export const parseData = (item: Barcode): IQrCodeDecoration | undefined => {
  if (!item.type) return;
  switch (getInternalType(item) || item.type) {
    case 'EMAIL':
    case 'MATMSG':
      return {
        icon: 'email',
        title: 'email_title',
        text: 'email_text',
      };
    case 'PHONE':
      return {
        icon: 'phone',
        title: 'phone_title',
        text: 'phone_text',
      };
    case 'CALENDAR_EVENT':
      return {
        icon: 'calendar',
        title: 'calendar_title',
        text: 'calendar_text',
      };
    case 'DRIVER_LICENSE':
      return {
        icon: 'card-account-details-outline',
        title: 'driver_licence_title',
        text: 'driver_licence_text',
      };
    case 'GEO':
      return {
        icon: 'map-outline',
        title: 'map_title',
        text: 'map_text',
      };
    case 'SMS':
      return {
        icon: 'message-text-outline',
        title: 'message_text_outline_title',
        text: 'message_text_outline_text',
      };
    case 'VCARD':
    case 'VCARD\nVERSION':
    case 'VCARD VERSION':
    case 'CONTACT_INFO':
      return {
        icon: 'card-account-details-outline',
        title: 'card_account_details_outline_title',
        text: 'card_account_details_outline_text',
      };
    case 'WIFI':
      return {
        icon: 'wifi',
        title: 'wifi_title',
        text: 'wifi_text',
      };
    case 'TEXT':
      return {
        icon: 'text-box-outline',
        title: 'text_title',
        text: 'text_text',
      };

    case 'ISBN':
      return {
        icon: 'book-outline',
        title: 'isbn_title',
        text: 'isbn_text',
      };

    case 'PRODUCT':
      return {
        icon: 'lightbulb-outline',
        title: 'product_title',
        text: 'product_text',
      };
    default:
      // Probably an URL or Other type not handle by default with RNCamera
      return extractTypeFromData(item);
  }
};
function extractTypeFromData(item: Barcode): IQrCodeDecoration | undefined {
  if (typeof item.data !== 'string') return;
  const type = item.data.split(':')[0].toUpperCase();

  // TODO: images, music, video, pdf, text and more social network
  switch (type) {
    case 'BITCOIN':
      return {
        icon: 'bitcoin',
        title: 'bitcoin_title',
        text: 'bitcoin_text',
      };
    case 'LITECOIN':
      return {
        icon: 'bitcoin',
        title: 'bitcoin_title',
        text: 'bitcoin_text',
      };
    case 'HTTP':
    case 'HTTPS':
      const url = new URL(item.data);
      if (url.hostname.toLowerCase().includes('twitter'))
        return {
          icon: 'twitter',
          title: url.hostname,
          text: 'twitter_link',
        };
      if (url.hostname.toLowerCase().includes('facebook'))
        return {
          icon: 'facebook',
          title: url.hostname,
          text: 'facebook_link',
        };
      if (url.hostname.toLowerCase().includes('instagram'))
        return {
          icon: 'instagram',
          title: url.hostname,
          text: 'instagram_link',
        };
      if (url.hostname.toLowerCase().includes('pinterest'))
        return {
          icon: 'pinterest',
          title: url.hostname,
          text: 'pinterest_link',
        };
      if (url.hostname.toLowerCase().includes('linkedin'))
        return {
          icon: 'linkedin',
          title: url.hostname,
          text: 'linkedin_link',
        };
    default:
      return {
        icon: 'link',
        title: item.data,
        text: 'url_link',
      };
  }
}
