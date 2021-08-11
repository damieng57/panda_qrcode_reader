import Realm from 'realm';
import {QrCodeSchema, DecorationSchema} from './models/models';
import {IQrCode} from '../../types';

export const realmSchemaConfiguration = {
  schema: [QrCodeSchema, DecorationSchema],
  schemaVersion: 8,
};

const realmInstance = new Realm(realmSchemaConfiguration);

/**
 * Get a singleton realm instance
 * @return {Realm}
 */
export const getRealmInstance = () => realmInstance;

// Functions
// Return all QrCodes
export const getAllQrCodes = () => {
  return getRealmInstance().objects('QrCode');
};

// Add a single qrCode using parameters
export const addQrCode = (qrCode: IQrCode) => {
  realmInstance.write(() => {
    realmInstance.create('QrCode', qrCode);
  });
};
