const crypto = require('crypto');
const db = require('../model/db');

const getHash = (password, salt) => crypto.pbkdf2Sync(password, salt, 1000, 512, 'sha512').toString('hex');

module.exports.setPassword = password => {
	const salt = crypto.randomBytes(16).toString('hex');
	const hash = getHash(password, salt);
	return {
		salt,
		hash
	}
};

module.exports.validPassword = ({password, email}) => {
	const user = db.getState().users.admin;
	const hash = getHash(password, user.salt);
	return user.hash === hash && user.email === email;
};
