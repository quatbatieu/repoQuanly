export const reverseObject = (obj) => {
	return Object.entries(obj).reduce((acc, [key, value]) => {
		acc[value] = key;
		return acc;
	}, {});
};


export const VEHICLE_TYPES_STATES_EXPORT = {
	1: "Xe ô tô con < 9 chỗ",
	10: "Phương tiện khác",
	20: "Xe rơ mooc, xe container (đầu kéo)"
}
// Sử dụng hàm reverseObject để đảo ngược key và value
export const VEHICLE_TYPES_STATES_IMPORT = reverseObject(VEHICLE_TYPES_STATES_EXPORT);