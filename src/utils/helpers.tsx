import {URL} from 'react-native-url-polyfill';
import {getLocales} from 'react-native-localize';
import { atomWithStorage } from './atomWithStorage'

export const historyAtom = atomWithStorage('DG:HISTORY', [])

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

export const getTranslation = (key:string) => {
  return translation[key] || '';
};

export const parseData: [string, string] = (data: string) => {
  if (typeof data !== 'string') return;
  const _temp = data.split(':');

  switch (_temp[0].toLowerCase()) {
    case 'mailto':
      return ['email', data, 'Email'];
    case 'sms':
      return ['message-text-outline', data, 'SMS'];
    case 'tel':
      return ['phone', data, 'Phone'];
    case 'geo':
      return ['map-outline', data, 'Map'];
    case 'bitcoin':
      return ['bitcoin', data, 'Bitcoin'];
    case 'litecoin':
      return ['litecoin', data, 'Litecoin'];
    case 'begin':
      if (_temp[1] === 'VCARD')
        return ['card-account-details-outline', data, 'VCard'];
      if (_temp[1] === 'VEVENT') return ['calendar', data, 'VEvent'];
    case 'mecard':
      return ['account-outline', data, 'MECard'];
    case 'wifi':
      return ['wifi', data, 'Wifi'];
    // TODO: images, music, video, pdf, text
    case 'http':
    case 'https':
      const url = new URL(data);
      if (url.hostname.toLowerCase().includes('twitter'))
        return ['twitter', url.hostname, 'Twitter link'];
      if (url.hostname.toLowerCase().includes('facebook'))
        return ['facebook', url.hostname, 'Facebook link'];
      if (url.hostname.toLowerCase().includes('instagram'))
        return ['instagram', url.hostname, 'Instagram link'];
      return ['link', url.hostname, 'Link'];
    default:
      return ['link', data, 'Link'];
  }
};
