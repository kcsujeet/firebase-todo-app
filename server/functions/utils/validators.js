exports.isEmpty = (string) => {
	return string===undefined || string.trim() === ''
};

exports.isEmail = (email) => {
	const emailRegEx = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
	return emailRegEx.test(email)
};


exports.validateLoginData = (data) => {
   let errors = {};
   if (this.isEmpty(data.email)) errors.email = 'Must not be empty';
   if (this.isEmpty(data.password)) errors.password = 'Must not be  empty';
   return {
       errors,
       valid: Object.keys(errors).length === 0 ? true : false
    };
};

exports.validateSignUpData = (data) => {
	let errors = {};

	if (this.isEmpty(data.email)) {
		errors.email = 'Must not be empty';
	} else if (!this.isEmail(data.email)) {
		errors.email = 'Must be valid email address';
	}

	if (this.isEmpty(data.firstName)) errors.firstName = 'Must not be empty';
	if (this.isEmpty(data.lastName)) errors.lastName = 'Must not be empty';
	if (this.isEmpty(data.password)) errors.password = 'Must not be empty';

	return {
		errors,
		valid: Object.keys(errors).length === 0 ? true : false
	};
};