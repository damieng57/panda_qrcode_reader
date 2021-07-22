import { parseData } from '../utils/helpers'

export interface IQrCode {
  _id: string;
  data: any;
  favorite: boolean;
}

export class QrCode implements IQrCode {
  _id = '';
  data = {};
  favorite = false;
  icon = 'link';
  title = '';
  text = 'Link';
  qrcode = {};

  constructor(value: any) {
    const _parsed = parseData(value.data);
    const _date = Date.now();

    const _temp = {
      _id: value._id + _date,
      date: _date,
      data: value.data,
      favorite: value.favorite,
      icon: _parsed[0],
      title: _parsed[1],
      text: _parsed[2]
    };
    Object.assign(this.qrcode, _temp);
  }

  get = () => {
    return this.qrcode;
  };
}
