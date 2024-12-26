const MARKETING_MESSAGE_SEND_STATUS_VALUES = {
  NEW: 1, //Đang chờ
  SENDING: 10, //Đang gửi đi
  COMPLETED: 50, //Hoàn tất
  FAILED: 20, // Gửi thất bại
  CANCELED: 30, // Đã hủy
  SKIP: 40, //Tạm ngưng
}

export const getMarketingMessageSendStatusList = (translation) => [
  { label: translation('sms.marketingMessageStatus.NEW'), value: MARKETING_MESSAGE_SEND_STATUS_VALUES.NEW },
  { label: translation('sms.marketingMessageStatus.SENDING'), value: MARKETING_MESSAGE_SEND_STATUS_VALUES.SENDING },
  { label: translation('sms.marketingMessageStatus.COMPLETED'), value: MARKETING_MESSAGE_SEND_STATUS_VALUES.COMPLETED },
  { label: translation('sms.marketingMessageStatus.FAILED'), value: MARKETING_MESSAGE_SEND_STATUS_VALUES.FAILED },
  { label: translation('sms.marketingMessageStatus.CANCELED'), value: MARKETING_MESSAGE_SEND_STATUS_VALUES.CANCELED },
  { label: translation('sms.marketingMessageStatus.SKIP'), value: MARKETING_MESSAGE_SEND_STATUS_VALUES.SKIP }
];

const messageTypesValues = {
  SMS_CSKH: 10,
  ZALO_CSKH: 20,
  APNS: 30,
  EMAIL: 40,
  SMS_PROMOTION: 50,
  ZALO_PROMOTION: 60,
};

export const getListMessageTypes = (translation) => [
  // { label: 'Tất cả', value: "" },
  { label: translation('sms.messageTypes.SMS_CSKH'), value: messageTypesValues.SMS_CSKH },
  { label: translation('sms.messageTypes.ZALO_CSKH'), value: messageTypesValues.ZALO_CSKH },
  { label: translation('sms.messageTypes.APNS'), value: messageTypesValues.APNS },
  { label: translation('sms.messageTypes.EMAIL'), value: messageTypesValues.EMAIL },
  { label: translation('sms.messageTypes.SMS_PROMOTION'), value: messageTypesValues.SMS_PROMOTION },
  { label: translation('sms.messageTypes.ZALO_PROMOTION'), value: messageTypesValues.ZALO_PROMOTION }
];

export const getListMessageTypesFilter = (translation) => [
  { label: 'Tất cả', value: "" },
  { label: translation('sms.messageTypes.SMS_CSKH'), value: "SMS_CSKH" },
  { label: translation('sms.messageTypes.ZALO_CSKH'), value: "ZALO_CSKH" },
  { label: translation('sms.messageTypes.APNS'), value: "APNS" },
  { label: translation('sms.messageTypes.EMAIL'), value: "EMAIL" },
  { label: translation('sms.messageTypes.SMS_PROMOTION'), value: "SMS_PROMOTION" },
  { label: translation('sms.messageTypes.ZALO_PROMOTION'), value: "ZALO_PROMOTION" }
];

export const MESSAGE_TYPES = {
  Completed : "Completed",
  Failed : "Failed" ,
  Canceled : "Canceled",
  ScheduleSend : "ScheduleSend"
}

export const MESSAGE_SEND_STATUS = {
  NEW: 1, // Đang chờ
  SENDING: 10, // Đang gửi đi
  COMPLETED: '50', // Hoàn tất
  FAILED: '20', // Gửi thất bại
  CANCELED: '30', // Đã hủy
  SKIP: '40' // Tạm ngưng
};

export const MARKETING_MESSAGE_SEND_STATUS = {
  NEW: 1, //Đang chờ
  SENDING: 10, //Đang gửi đi
  COMPLETED: 50, //Hoàn tất
  FAILED: 20, // Gửi thất bại
  CANCELED: 30, // Đã hủy
  SKIP: 40, //Tạm ngưng
}

export const getTranslationKeys = (translation) => {
  return {
    "vehiclePlateNumber": translation('sms.translationKeys.vehiclePlateNumber'),
    "customerRecordCheckExpiredDate": translation('sms.translationKeys.customerRecordCheckExpiredDate'),
    "stationCode": translation('sms.translationKeys.stationCode'),
    "stationsAddress": translation('sms.translationKeys.stationsAddress'),
    "stationsHotline": translation('sms.translationKeys.stationsHotline'),
    "customerRecordPlatenumber": translation('sms.translationKeys.customerRecordPlatenumber'),
    "stationsName": translation('sms.translationKeys.stationsName')
  };
};