const MIN_PLATE_NUMBER = 6;
const MAX_PLATE_NUMBER = 14; 

export const validatorPlateNumber = (value, translation) => {
	if (!value) {
		return Promise.reject(new Error(translation("accreditation.isRequire")));
	}
	if ((value.length < MIN_PLATE_NUMBER || value.length > MAX_PLATE_NUMBER)) {
		return Promise.reject(new Error(translation("accreditation.licensePlateError")))
	}
	if (!(/\d/.test(value) && /[a-zA-Z]+/.test(value))) {
		return Promise.reject(translation("accreditation.licensePlateError"));
	}
	if (!/^[a-z0-9]+$/i.test(value)) {
		return Promise.reject(translation("accreditation.licensePlateError"));
	}
	return Promise.resolve();
}