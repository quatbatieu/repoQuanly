import React from 'react';
import { BiWallet, BiCreditCard, BiBarcode, BiDollarCircle, BiMoney, BiBuildingHouse, BiCreditCardFront } from 'react-icons/bi';
import { FaCcVisa , FaCreditCard  } from 'react-icons/fa';
import { ReactComponent as ViSaIcon } from '../assets/new-icons/visa.svg'
import { ReactComponent as VNPayIcon } from '../assets/new-icons/vnpay.svg'
import { ReactComponent as CashIcon } from '../assets/new-icons/cash-icon.svg'
import AtmIcon from "../assets/new-icons/BookingHistory-icon/atmCard.png";
import iconBank from "../assets/new-icons/BookingHistory-icon/imageBank.png";
import iconMomo from "../assets/new-icons/BookingHistory-icon/momoPng.png";

export const PAYMENT_STATE = {
  NEW: 'New', // Chưa thanh toán
  PENDING: 'Pending', // Đang xử lý
  FAILED: 'Failed', // Thanh toán thất bại
  SUCCESS: 'Success', // Đã thanh toán
  CANCELED: 'Canceled', // Đã hủy
};

export const STATUS_COLOR = {
  [PAYMENT_STATE.NEW]: 'gray',
  [PAYMENT_STATE.PENDING]: 'blue',
  [PAYMENT_STATE.FAILED]: 'red',
  [PAYMENT_STATE.SUCCESS]: 'green',
  [PAYMENT_STATE.CANCELED]: 'orange',
};

export const getPaymentStatusList = (translation) => {
  return {
    [PAYMENT_STATE.NEW]: translation("receipt.New"),
    [PAYMENT_STATE.PENDING]: translation("receipt.Pending"),
    [PAYMENT_STATE.SUCCESS]: translation("receipt.Success"),
    [PAYMENT_STATE.CANCELED]: translation("receipt.Canceled"),
    [PAYMENT_STATE.FAILED]: translation("receipt.Failed")
  };
};

export const PAYMENT_TYPE_STATE = {
  CASH: "cash", // Thanh toán bằng tiền mặt
  BANK_TRANSFER: "atm", // Chuyển tiền qua tài khoản ngân hàng
  VNPAY_PERSONAL: "vnpay", // Chuyển tiền qua VNPAY
  CREDIT_CARD: "creditcard", // Thanh toán bằng thẻ tín dụng
  MOMO_PERSONAL: "momo", // Chuyển tiền qua MoMo
  ATM_TRANSFER: "domesticcard", // Thanh toán bằng thẻ nội địa (ATM)
  MOMO_BUSINESS: "momobusiness", // Thanh toán qua MoMo
}

export const optionPaymentTypes = (translation) => {
  return [
    {
      id : 1,
      value: 'cash',
      label: translation("setting.payment.options.cash"),
      icon: (
        <div style={{ width: '31px', height: '31px', background: '#EBEBEB' }} className="d-flex align-items-center justify-content-center">
          <CashIcon className="w-icon " style={{ width: '31px', height: '31px' }}/>
        </div>
      )
    },
    {
      id : 2,
      value: 'atm',
      label: translation("setting.payment.options.bankTransfer"),
      icon: (
        <div style={{ width: '31px', height: '31px', background: '#EBEBEB' }} className="d-flex align-items-center justify-content-center">
          <img src={iconBank} style={{ width: '20px', height: '20px' }} />
        </div>
      )
    },
    {
      id : 5,
      value: 'momo',
      label: translation("setting.payment.options.momoPersonal"),
      icon: (
        <div style={{ width: '31px', height: '31px', background: '#EBEBEB' }} className="d-flex align-items-center justify-content-center">
          <img src={iconMomo} style={{ width: '31px', height: '31px' }} />
        </div>
      )
    },
    {
      id: 4,
      value: 'creditcard', // visa
      label: translation("setting.payment.options.visaMasterJcb"),
      icon: (
        <div style={{ width: '31px', height: '31px', background: '#EBEBEB' }} className="d-flex align-items-center justify-content-center">
          <ViSaIcon className="w-icon " style={{ width: '31px', height: '31px' }} />
        </div>
      )
    },
    {
      id :7,
      value: 'momobusiness',
      label: translation("setting.payment.options.momoBusiness"),
      icon: (
        <div style={{ width: '31px', height: '31px', background: '#EBEBEB' }} className="d-flex align-items-center justify-content-center">
          <img src={iconMomo} style={{ width: '31px', height: '31px' }} />
        </div>
      )
    },
    {
      id : 6,
      value: 'domesticcard',
      label: translation("setting.payment.options.domesticcard"),
      icon: (
        <div style={{ width: '31px', height: '31px', background: '#EBEBEB' }} className="d-flex align-items-center justify-content-center">
          <img src={AtmIcon} style={{ width: '31px', height: '31px' }} />
        </div>
      ),
      disabled : true,
    },
    {
      id : 3,
      value: 'vnpay', // visa
      label: translation("setting.payment.options.vnPay"),
      icon: (
        <div style={{ width: '31px', height: '31px', background: '#EBEBEB' }} className="d-flex align-items-center justify-content-center">
          <VNPayIcon className="w-icon " style={{ width: '31px', height: '31px' }} />
        </div>
      ),
      disabled: true,
    }
  ];
};
