import teleSvg from "../assets/icons/telegram.svg"
import zalo from '../assets/icons/zalo.svg'
import logo from '../assets/icons/logo-ttdk.png'
import fpt from '../assets/icons/fpt.svg'
import viettel from '../assets/icons/viettel.svg'
import vnpt from '../assets/icons/vnpt.svg'
import vivas from '../assets/icons/logo_vivas.png'
import vmg from '../assets/icons/vmg.png'
import zaloZns from '../assets/icons/zalo-zns.png'
import sunpay from '../assets/icons/sunpay.png'
import capitalpay from '../assets/icons/capitalpay.svg'
import mailgun from '../assets/icons/mailgun.svg'
import vnpay from '../assets/icons/vnpay.svg'
import   tingee  from '../assets/icons/tingee.png'
import momo from '../assets/icons/Momo.png'
import zalopay from '../assets/icons/zalopay.png'
import banking from '../assets/icons/banking.png'
import viettelpay from '../assets/icons/viettelpay.png'
import vietQR from '../assets/icons/VietQR.png'


export const FETCH_APPS_REQUEST = 'FETCH_APPS_REQUEST'
export const FETCH_APPS_SUCCESS = 'FETCH_APPS_SUCCESS'
export const FETCH_APP_CHANGE = 'FETCH_APP_CHANGE'


export const THIRDPARTY_CODE = {
  //NOTIFICATION
  ZALO: 'ZALO',
  TELEGRAM: 'TELEGRAM',
  //SMS
  TTDK: 'TTDK',
  VIVAS: 'VIVAS',
  VMG:'VMG',
  FPT: 'FPT',
  VNPT: 'VNPT',
  VIETTEL: 'VIETTEL',
  //ZALO_MESSAGE
  ZALO_ZNS: 'ZALO_ZNS',
  SMARTGIFT: 'SMARTGIFT',
  //EMAIL
  SMTP: 'SMTP',
  MAILGUN: 'MALGUN',
  //Payment
  TINGEE: 'TINGEE',
  CAPITAL_PAY: 'CAPITAL_PAY',
  SUNPAY: 'SUNPAY',
  BANKING_MANUAL: 'BANKING_MANUAL',
  BANKING_VIETQR: 'BANKING_VIETQR',
  MOMO_PERSONAL: 'MOMO_PERSONAL',
  MOMO_BUSINESS: 'MOMO_BUSINESS',
  VNPAY_BUSINESS:'VNPAY_BUSINESS',
  ZALOPAY_PERSONAL: 'ZALOPAY_PERSONAL',
  ZALOPAY_BUSINESS: 'ZALOPAY_BUSINESS',
  VIETTELPAY_PERSONAL: 'VIETTELPAY_PERSONAL',
  VIETTELPAY_BUSINESS: 'VIETTELPAY_BUSINESS',
  MOMO_BUSINESS:'MOMO_BUSINESS',
  VNPAY_PERSONAL:'VNPAY_PERSONAL',
}

export const THIRDPARTY_CATEGORY = {
  PAYMENT: 1,
  NOTIFICATION: 2000,
  SMS: 3000,
  ZALO_MESSAGE: 4000,
  EMAIL: 5000
}

//map image của thirdparty
export const THIRDPARTY_CODE_IMAGE = {
  [THIRDPARTY_CODE.CAPITAL_PAY]: capitalpay,
  [THIRDPARTY_CODE.SUNPAY]: sunpay,
  [THIRDPARTY_CODE.VNPAY_PERSONAL]: vnpay,
  [THIRDPARTY_CODE.VNPAY_BUSINESS]: vnpay,
  [THIRDPARTY_CODE.TELEGRAM]: teleSvg,
  [THIRDPARTY_CODE.ZALO]: zalo,
  [THIRDPARTY_CODE.TTDK]: logo, // Assuming logo is used for TTDK
  [THIRDPARTY_CODE.VIVAS]: vivas,
  [THIRDPARTY_CODE.VMG]: vmg,
  [THIRDPARTY_CODE.FPT]: fpt,
  [THIRDPARTY_CODE.VNPT]: vnpt,
  [THIRDPARTY_CODE.VIETTEL]: viettel,
  [THIRDPARTY_CODE.ZALO_ZNS]: zaloZns,
  // [THIRDPARTY_CODE.SMARTGIFT]: logo, // Assuming logo is used for SMARTGIFT
  // [THIRDPARTY_CODE.SMTP]: logo, // Assuming logo is used for SMTP
  [THIRDPARTY_CODE.MAILGUN]: mailgun,
  [THIRDPARTY_CODE.TINGEE]: tingee,
  [THIRDPARTY_CODE.MOMO_PERSONAL]: momo,
  [THIRDPARTY_CODE.MOMO_BUSINESS]: momo,
  [THIRDPARTY_CODE.ZALOPAY_PERSONAL]: zalopay,
  [THIRDPARTY_CODE.ZALOPAY_BUSINESS]: zalopay,
  [THIRDPARTY_CODE.BANKING_MANUAL]: banking,
  [THIRDPARTY_CODE.BANKING_VIETQR]: vietQR,
  [THIRDPARTY_CODE.VIETTELPAY_PERSONAL]: viettelpay,
  [THIRDPARTY_CODE.VIETTELPAY_BUSINESS]: viettelpay,

}

// tắt mở sử dụng thirdparty
export const THIRDPARTY_CODE_ENABLE = {
  [THIRDPARTY_CODE.CAPITAL_PAY]: false,
  [THIRDPARTY_CODE.SUNPAY]: false,
  [THIRDPARTY_CODE.VNPAY_PERSONAL]: true,
  [THIRDPARTY_CODE.VNPAY_BUSINESS]: false,
  [THIRDPARTY_CODE.ZALO]: false,
  [THIRDPARTY_CODE.TELEGRAM]: true,
  [THIRDPARTY_CODE.TINGEE]: true,
  [THIRDPARTY_CODE.TTDK]: false,
  [THIRDPARTY_CODE.VMG]: true,
  [THIRDPARTY_CODE.VIVAS]: false,
  [THIRDPARTY_CODE.FPT]: false,
  [THIRDPARTY_CODE.VNPT]: false,
  [THIRDPARTY_CODE.VIETTEL]: false,
  [THIRDPARTY_CODE.ZALO_ZNS]: false,
  [THIRDPARTY_CODE.SMARTGIFT]: true,
  [THIRDPARTY_CODE.SMTP]: false,
  [THIRDPARTY_CODE.MAILGUN]: false,
  [THIRDPARTY_CODE.BANKING_MANUAL]: true,
  [THIRDPARTY_CODE.BANKING_VIETQR]: true,
  [THIRDPARTY_CODE.MOMO_PERSONAL]: true,
  [THIRDPARTY_CODE.MOMO_BUSINESS]: true,
  [THIRDPARTY_CODE.ZALOPAY_PERSONAL]: false,
  [THIRDPARTY_CODE.ZALOPAY_BUSINESS]: false,
  [THIRDPARTY_CODE.VIETTELPAY_PERSONAL]: false,
  [THIRDPARTY_CODE.VIETTELPAY_BUSINESS]: false,

}

// Các quyền truy cập trên mobile
export const MOBILE_APP_PERMISSION_TYPE = {
  CAMERA: 'camera',
}

export const MIN_COLUMN_WIDTH = '60px'
export const NORMAL_COLUMN_WIDTH = '120px'
export const BIG_COLUMN_WIDTH = '160px'
export const VERY_BIG_COLUMN_WIDTH = '200px'
export const EXTRA_BIG_COLUMND_WITDTH = '250px'

