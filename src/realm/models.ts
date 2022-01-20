// Realm scheams
import Realm from 'realm';
import {IQrCodeDecoration} from '../types';

/**
 * Decoration
 */
export class DecorationSchema implements IQrCodeDecoration {
  title = '';
  icon = '';
  text?: string | undefined;

  /**
   * Getter of the class
   * @return {string} class name
   */
  static getDecorationModelName() {
    return DecorationSchema.schema.name;
  }

  /**
   * Getter embedded
   * @return {boolean} return embedded true or false
   */
  static isEmbedded() {
    return DecorationSchema.schema.embedded;
  }

  /**
   * class {realm} schema
   * @type {Object}
   */
  static schema: Realm.ObjectSchema = {
    name: 'Decoration',
    embedded: true,
    properties: {
      title: 'string',
      icon: 'string',
      text: 'string',
    },
  };
}

export const QrCodeSchema = {
  name: 'QrCode',
  embedded: false,
  primaryKey: '_id',
  properties: {
    _id: 'objectId',
    _type: 'string',
    type: 'string',
    data: 'string',
    favorite: 'bool',
    markedToDelete: 'bool',
    date: 'date',
    decoration: 'Decoration?',
    qrCode: 'string?',
  },
};
