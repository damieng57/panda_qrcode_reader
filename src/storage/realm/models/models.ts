// Realm scheams
import Realm from 'realm';
import {ObjectId} from 'bson';
import {IQrCode, IQrCodeDecoration} from '../../../types';

/**
 * Decoration
 */
export class DecorationSchema implements IQrCodeDecoration {
  title: string = '';
  icon: string = '';
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

// export const DecorationSchema = {
//   name: 'Decoration',
//   embedded: true,
//   properties: {
//     title: 'string',
//     icon: 'string',
//     text: 'string',
//   },
// };

/**
 * QrCode
 */
export class QrCodeSchema implements IQrCode {
  _id: ObjectId = new ObjectId();
  _type: string = '';
  type: string = '';
  data: string = '';
  favorite: boolean = false;
  date: Date = new Date();
  decoration?: IQrCodeDecoration = undefined;
  qrCode?: string = '';
  constructor({_id, _type, type, data, favorite, date, decoration, qrCode}) {
    this._id = _id;
    this._type = _type;
    this.type = type;
    this.data = data;
    this.favorite = favorite;
    this.date = date;
    this.decoration = decoration;
    this.qrCode = qrCode;
  }


  /**
   * Getter of the class
   *  @return {string} class name
   */
  static getQrCodeModelName() {
    return QrCodeSchema.schema.name;
  }

  /**
   * Getter embedded
   *  @return {boolean} return embedded true or false
   */
  static getEmbedded() {
    return QrCodeSchema.schema.embedded;
  }

  /**
   * Getter QrCode primary key
   * @return {objectId} return the primary key of the QrCode
   */
  static getPrimaryKey() {
    return QrCodeSchema.schema.primaryKey;
  }

  /**
   * class {realm} schema
   * @type {Object}
   */
  static schema: Realm.ObjectSchema = {
    name: 'QrCode',
    embedded: false,
    primaryKey: '_id',
    properties: {
      _id: 'objectId',
      _type: 'string',
      type: 'string',
      data: 'string',
      favorite: 'bool',
      date: 'date',
      decoration: 'Decoration?',
      qrCode: 'string?',
    },
  };
}

// export const QrCodeSchema = {
//   name: 'QrCode',
//   embedded: false,
//   primaryKey: '_id',
//   properties: {
//     _id: 'objectId',
//     _type: 'string',
//     type: 'string',
//     data: 'string',
//     favorite: 'bool',
//     date: 'date',
//     decoration: 'Decoration?',
//     qrCode: 'string?',
//   },
// };
