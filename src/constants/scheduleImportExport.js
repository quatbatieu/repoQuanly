export const reverseObject = (obj) => {
	return Object.entries(obj).reduce((acc, [key, value]) => {
		acc[value] = key;
		return acc;
	}, {});
};

export const SCHEDULE_STATUS_STATES_EXPORT = {
	0: "chưa xác nhận",
	10: "đã xác nhận",
	20: "đã hủy",
	30: "đã xong"
}
// Sử dụng hàm reverseObject để đảo ngược key và value
export const SCHEDULE_STATUS_STATES_IMPORT = reverseObject(SCHEDULE_STATUS_STATES_EXPORT);

export const LICENSE_PLATE_COLOR_STATES_EXPORT = {
	1: "Trắng",
	2: "Xanh",
	3: "Vàng",
	4: "Đỏ"
}
// Sử dụng hàm reverseObject để đảo ngược key và value
export const LICENSE_PLATE_COLOR_STATES_IMPORT = reverseObject(LICENSE_PLATE_COLOR_STATES_EXPORT);

export const VEHICLE_TYPES_STATES_EXPORT = {
	1: "Xe ô tô con < 9 chỗ",
	10: "Phương tiện khác",
	20: "Xe rơ mooc, xe container (đầu kéo)"
}
// Sử dụng hàm reverseObject để đảo ngược key và value
export const VEHICLE_TYPES_STATES_IMPORT = reverseObject(VEHICLE_TYPES_STATES_EXPORT);