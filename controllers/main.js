const db = require('../model/db');
const nodemailer = require('nodemailer');
const config = require('../config/config.json');
const validation = require('../libs/validationForm');

const isSend = async req => {
	const {name, email, message} = req.body;
	try {
		await nodemailer.createTestAccount();
		const transporter = nodemailer.createTransport(config.mail.smtp);
		const mailOptions = {
			from: `"${name}" <${email}>`,
			to: config.mail.smtp.auth.user,
			subject: config.mail.subject,
			text: message.trim().slice(0, 500) +
			`\n Отправлено с: <${email}>`
		};
		await transporter.sendMail(mailOptions);
		return true;
	} catch (error) {
		return false;
	}
};

module.exports.getIndex = (req, res) => {
	res.render('pages/index', {
		products: db.get('products').value(),
		skills: db.get('skills').value()
	});
};

module.exports.postIndex = async (req, res) => {
	if (!validation(req)) {
		return res.json({
			message: `Одно или несколько полей не заполнены`,
			status: 'Error'
		});
	}
	const result = await isSend(req);
	return res.json({
		message: result ? `Письмо успешно отправлено` : `При отправке письма произошла ошибка`,
		status: result ? 'OK' : 'Error'
	});
};
