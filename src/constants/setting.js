import React from 'react';
import BankTransferModal from '../Page/Setting/BankTransferModal';
import MomoPopup from '../Page/Setting/MomoPopup';
import MomoPersonalPopup from 'Page/Setting/MomoPersonalPopup';
import MomoBusinessPopup from 'Page/Setting/MomoBusinessPopup';
import { BiWallet, BiCreditCard, BiBarcode, BiDollarCircle, BiMoney, BiBuildingHouse, BiCreditCardFront } from 'react-icons/bi';

export const SETTING = "SETTING"

export const PAYMENT_TYPE_STATE = {
  CASH: 1, // Thanh toán bằng tiền mặt
  BANK_TRANSFER: 2, // Chuyển tiền qua tài khoản ngân hàng
  VNPAY_PERSONAL: 3, // Chuyển tiền qua VNPAY
  CREDIT_CARD: 4, // Thanh toán bằng thẻ tín dụng
  MOMO_PERSONAL: 5, // Chuyển tiền qua MoMo
  ATM_TRANSFER: 6, // Thanh toán bằng thẻ nội địa (ATM)
  MOMO_BUSINESS: 7, // Thanh toán qua MoMo
  ZALOPAY_PERSONAL:8, // Chuyển tiền qua Zalo
  VIETTELPAY_PERSONAL:9, // Chuyển tiền qua Viettelpay
}

export const optionPaymentTypes = (translation) => {
  return [
    {
      value: PAYMENT_TYPE_STATE.CASH,
      label: translation("setting.payment.options.cash"),
      icon: <div style={{ width: '40px', height: '40px', background: "#EBEBEB"}} className='d-flex align-items-center justify-content-center'><BiDollarCircle className="w-icon" style={{ fontSize: 40 }}/></div>,
    },
    {
      value: PAYMENT_TYPE_STATE.BANK_TRANSFER,
      label: translation("setting.payment.options.bankTransfer"),
      icon: <div style={{ width: '40px', height: '40px', background: "#EBEBEB"}} className='d-flex align-items-center justify-content-center'><BiBuildingHouse className="w-icon" style={{ fontSize: 40 }} /></div>,
      modalComponent: BankTransferModal,
    },
    {
      value: PAYMENT_TYPE_STATE.VNPAY_PERSONAL,
      label: translation("setting.payment.options.vnPay"),
      icon: <div style={{ width: '40px', height: '40px', background: "#EBEBEB"}} className='d-flex align-items-center justify-content-center'><BiWallet className="w-icon" style={{ fontSize: 40 }} /></div>
    },
    {
      value: PAYMENT_TYPE_STATE.MOMO_PERSONAL,
      label: translation("setting.payment.options.momoPersonal"),
      icon: <div style={{ width: '40px', height: '40px', background: "#EBEBEB"}} className='d-flex align-items-center justify-content-center'><BiWallet className="w-icon" style={{ fontSize: 40 }} /></div>,
      modalComponent: MomoPersonalPopup,
    },
    {
      value: PAYMENT_TYPE_STATE.MOMO_BUSINESS,
      label: translation("setting.payment.options.momoBusiness"),
      icon: <div style={{ width: '40px', height: '40px', background: "#EBEBEB"}} className='d-flex align-items-center justify-content-center'><BiMoney className="w-icon" style={{ fontSize: 40 }} /></div>,
      modalComponent: MomoBusinessPopup,
    },
    {
      value: PAYMENT_TYPE_STATE.ATM_TRANSFER,
      label: translation("setting.payment.options.domesticcard"),
      icon: <div style={{ width: '40px', height: '40px', background: "#EBEBEB"}} className='d-flex align-items-center justify-content-center'><BiCreditCardFront className="w-icon" style={{ fontSize: 40 }} /></div>,
      dependent : PAYMENT_TYPE_STATE.MOMO_BUSINESS,
      disabled : true,
    },
    {
      value: PAYMENT_TYPE_STATE.CREDIT_CARD,
      label: translation("setting.payment.options.visaMasterJcb"),
      icon: <div style={{ width: '40px', height: '40px', background: "#EBEBEB"}} className='d-flex align-items-center justify-content-center'><BiCreditCard className="w-icon" style={{ fontSize: 40 }} /></div>,
      dependent : PAYMENT_TYPE_STATE.MOMO_BUSINESS,
      disabled: true,
    },
    {
      value: PAYMENT_TYPE_STATE.ZALOPAY_PERSONAL,
      label: translation("expand_setting.ZALOPAY_PERSONAL"),
      icon: <div style={{ width: '40px', height: '40px', background: "#EBEBEB"}} className='d-flex align-items-center justify-content-center'><BiWallet className="w-icon" style={{ fontSize: 40 }} /></div>,
    },
    {
      value: PAYMENT_TYPE_STATE.VIETTELPAY_PERSONAL,
      label: translation("expand_setting.VIETTELPAY_PERSONAL"),
      icon: <div style={{ width: '40px', height: '40px', background: "#EBEBEB"}} className='d-flex align-items-center justify-content-center'><BiWallet className="w-icon" style={{ fontSize: 40 }} /></div>,
    }
  ];
};

export const optionServiceType = (translation) => [
  {
    value: 1,
    label: translation("serviceTypes.checkingViolation"),
    servicePrice: 0,
  },
  {
    value: 2,
    label: translation("serviceTypes.createTagVetc"),
    servicePrice: 0,
  },
  {
    value: 3,
    label: translation("serviceTypes.payViolationFee"),
    servicePrice: 0,
  },
  {
    value: 4,
    label: translation("serviceTypes.extendInsuranceTnds"),
    servicePrice: 0,
  },
  {
    value: 5,
    label: translation("serviceTypes.payVetcFee"),
    servicePrice: 0,
  },
  {
    value: 6,
    label: translation("serviceTypes.extendIssuranceBody"),
    servicePrice: 0,
  },
  {
    value: 7,
    label: translation("serviceTypes.repairService"),
    servicePrice: 0,
  },
  {
    value: 8,
    label: translation("serviceTypes.inspectCar"),
    servicePrice: 0,
  },
  {
    value: 9,
    label: translation("serviceTypes.payEpassFee"),
    servicePrice: 0,
  },
  {
    value: 10,
    label: translation("serviceTypes.helpService"),
    servicePrice: 0,
  },
  {
    value: 11,
    label: translation("serviceTypes.consultationImprovement"),
    servicePrice: 0,
  },
];

