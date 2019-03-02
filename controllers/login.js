const validationEmptyValue = require('../libs/validationForm');
const {validPassword} = require('../libs/cryptoUser');

module.exports.isLogin = (req, res, next) => {
	req.session.isAuth ? res.redirect('/admin') : next();
};

module.exports.getLogin = (req, res) => {
	res.render('pages/login');
};

module.exports.postLogin = (req, res) => {
	if (!validationEmptyValue(req)) {
		return res.render('pages/login', {msgslogin: 'Одно или несколько полей не заполнены'});
	}
	const isAdmin = validPassword(req.body);
	if (isAdmin) {
		req.session.isAuth = true;
		return res.redirect('/admin');
	}
	return res.render('pages/login', {msgslogin: 'Не удалось войти'});
};
