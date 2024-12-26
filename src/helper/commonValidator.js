import * as Yup from 'yup';

const MIN_PHONE = 8;
const MAX_PHONE = 12;

export const validatorPhone = (value, translation) => {
	if (!value) {
		return Promise.reject(new Error(translation("accreditation.isRequire")));
	}
	if ((value.length < MIN_PHONE || value.length > MAX_PHONE)) {
		return Promise.reject(new Error(translation("accreditation.phoneError")))
	}
  if (!/^[0-9]+$/i.test(value)) {
		return Promise.reject(translation("accreditation.phoneError"));
	}
	if (value === '0'.repeat(value.length)) {
    return Promise.reject(new Error(translation("accreditation.phoneError")));
  }

	return Promise.resolve();
}

export const validatorPhoneAllowEmpty = (value, translation) => {
	if(!value) {
		return Promise.resolve();
	}
	if ((value.length < MIN_PHONE || value.length > MAX_PHONE)) {
		return Promise.reject(new Error(translation("accreditation.phoneError")))
	}
  if (!/^[0-9]+$/i.test(value)) {
		return Promise.reject(translation("accreditation.phoneError"));
	}
	if (value === '0'.repeat(value.length)) {
    return Promise.reject(new Error(translation("accreditation.phoneError")));
  }
	return Promise.resolve();
}

export const validatorEmail = (value, translation) => {
  const validationSchema = Yup.string()
    .required(translation('accreditation.isRequire'))
    .email(translation('invalidEmail'));

  return validationSchema.validate(value)
    .catch(error => Promise.reject(error.message));
};

export const validatorEmailAllowEmpty = (value, translation) => {
	if (!value) {
		return Promise.reject(new Error(translation("accreditation.isRequire")));
	}
	if (!value.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)) {
		return Promise.reject(new Error(translation("invalidEmail")));
	} 
  const validationSchema = Yup.string()
    .notRequired(translation('accreditation.isRequire'))
    .email(translation('invalidEmail'));

  return validationSchema.validate(value)
    .catch(error => Promise.reject(error.message));
};

const MIN_PASSWORD = 6;
export const validatorPassword = (value, translation , textError) => {
	if(!value) {
		return Promise.reject(translation("isReq"))
	}

	if(value.length < MIN_PASSWORD) {
		return Promise.reject(textError || translation("minPassword"));
	}
	return Promise.resolve();
}