const fs = require('fs');
const path = require('path');
const db = require('../model/db');
const formidable = require('formidable');
const validationEmptyValue = require('../libs/validationForm');

const validation = (fields, files) => {
	if (files.photo.name === '' || files.photo.size === 0) {
		return {status: 'Не загружена картинка!', err: true}
	}
	if (!fields.name) {
		return {status: 'Не указано описание картинки!', err: true}
	}

	if (!fields.price || !Number.isFinite(+fields.price)) {
		return {status: 'Не указана цена!', err: true}
	}
	return {status: 'Ok', err: false}
};

const getSkills = (req, res) => {
	if (!validationEmptyValue(req)) {
		return res.render('pages/admin', {[`ms${req.params.info}`]: 'Одно или несколько полей не заполнены'});
	}
	db.get('skills').value().forEach(item => {
		item.number = req.body[item.type];
	});
	setTimeout(() => {
		db.write();
	}, 500);
	return res.redirect('/admin');
};

const getUpload = (req, res, next) => {
	const form = new formidable.IncomingForm();
	const upload = path.join('./public', 'assets', 'img/products');
	if (!fs.existsSync(upload)) {
		fs.mkdirSync(upload);
	}
	form.uploadDir = path.join(process.cwd(), upload);
	form.parse(req, function (err, fields, files) {
		if (err) {
			return next(err);
		}
		const valid = validation(fields, files);
		if (valid.err) {
			fs.unlink(files.photo.path, err => err && next(err));
			return res.render('pages/admin', {[`ms${req.params.info}`]: valid.status});
		}

		const fileName = path.join(upload, files.photo.name);
		fs.rename(files.photo.path, fileName, err => {
			if (err) {
				return next(err);
			}
			setTimeout(() => {
				db.get('products')
					.push({
						"src": path.join(upload.replace('public', '.'), files.photo.name),
						"name": fields.name,
						"price": +fields.price
					})
					.write();
			}, 1000);
			return res.redirect('/admin');
		});
	});
};

const requestMap = {
	'skills': getSkills,
	'upload': getUpload
};

module.exports.isAdmin = (req, res, next) => {
	if (!req.session.isAuth) {
		const err = new Error('Not found');
		err.status = 404;
		next(err);
	} else {
		next();
	}
};

module.exports.getAdmin = (req, res) => {
	res.render('pages/admin');
};

module.exports.postAdmin = (req, res, next) => requestMap[req.params.info](req, res, next);
