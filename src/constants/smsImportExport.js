export const reverseObject = (obj) => {
	return Object.entries(obj).reduce((acc, [key, value]) => {
		acc[value] = key;
		return acc;
	}, {});
};

export const MESSAGE_SEND_STATUS_EXPORT = {
  1: 'Mới',
  10: 'Đang gửi',
  50: 'Đã gửi',
  20: 'Thất bại',
  30: 'Đã huỷ',
  40: 'Tạm ngưng'
};

// Sử dụng hàm reverseObject để đảo ngược key và value
export const MESSAGE_SEND_STATUS_IMPORT = reverseObject(MESSAGE_SEND_STATUS_EXPORT);

export const MESSAGE_TYPE_STATUS_EXPORT = {
  1: 'Mới',
  10: 'Đang gửi',
  50: 'Đã gửi',
  20: 'Thất bại',
  30: 'Đã huỷ',
  40: 'Tạm ngưng'
};
export const MESSAGE_TYPE_STATUS_IMPORT = reverseObject(MESSAGE_TYPE_STATUS_EXPORT);

export const MESSAGE_CATEGORIES_EXPORT = {
  10: 'SMS_CSKH',
  20: 'ZALO_CSKH',
  30: 'APNS',
  40: 'EMAIL',
  50: 'SMS_PROMOTION',
  60: 'ZALO_PROMOTION'
};
export const MESSAGE_CATEGORIES_IMPORT = reverseObject(MESSAGE_TYPE_STATUS_EXPORT);