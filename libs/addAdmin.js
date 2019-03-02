const psw = require('./cryptoUser');
const db = require('../model/db');
const users = db.getState().users;

if (!users) {
	db.set('users', {}).write();
}

const admin = db.get('users').admin;

if (!admin) {
	const password = psw.setPassword('123');
	const authInfoAdmin = {
		email: 'admin@admin.ru',
		hash: password.hash,
		salt: password.salt
	};
	const user = {
		admin: authInfoAdmin
	};
	db.set('users', user).write();
}
