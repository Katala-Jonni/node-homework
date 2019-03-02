const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const app = express();

app.set('views', './source/template');
app.set('view engine', 'pug');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

process.env.AUTH_SECRET_SESSION = 'loftschool';

app.use(session({
	secret: process.env.AUTH_SECRET_SESSION,
	key: 'example',
	cookie: {
		path: '/',
		httpOnly: true,
		maxAge: 10 * 60 * 1000
	},
	saveUninitialized: false,
	resave: true
}));

app.use(express.static(path.join(process.cwd(), '/public')));

app.use('/', require('./routes'));

app.use((req, res, next) => {
	if (req.url !== '/favicon.ico') {
		const err = new Error('Not found');
		err.status = 404;
		next(err);
	}
});

app.use((err, req, res, next) => {
	res.status(err.status || 500);
	res.render('pages/error', {message: err.message, error: err})
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
	console.log(`Server started on port ${port}`);
});
