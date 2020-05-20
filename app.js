const express = require('express');
const bcrypt = require('bcrypt');
require('dotenv').config();
const port = process.env.PORT || 3000;

const app = express();
app.set('view engine', 'hbs');
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static('public'));
const cookieParser = require('cookie-parser');
const session = require('express-session');
const FileStore = require('session-file-store')(session);

const User = require('./userModel');

const additionalArgs = (arg) => {
	return function(req, res, next) {
		if (!req.session.user) {
			res.redirect('/' + arg);
		} else {
			next();
		}
	};
};

const sessionChecker = (req, res, next) => {
	if (!req.session.user) {
		res.redirect('/');
	} else {
		next();
	}
};

app.use(cookieParser());

app.get('/', (req, res) => {
	res.render('index');
});

app.get('/login', (req, res) => {
	res.redirect(300, '/');
});

app.use(
	session({
		store: new FileStore(),
		key: 'user_sid',
		secret: 'anything here',
		resave: false,
		saveUninitialized: false,
		cookie: {
			expires: 600000
		}
	})
);

app.post('/login', async (req, res) => {
	const { name, password } = req.body;
	const user = await User.findOne({ username: name });

	if (user && (await bcrypt.compare(password, user.password))) {
		req.session.user = { privet: 123 };
		res.redirect('bingo');
	} else {
		res.redirect('/register');
	}
});

app.get('/bingo', additionalArgs('register'), (req, res) => {
	res.render('bingo');
});

app.get('/register', (req, res) => {
	res.render('register');
});

app.post('/register', async (req, res, next) => {
	const { name, password } = req.body;

	const user = new User({
		username: name,
		password: await bcrypt.hash(password, 10)
	});
	await user.save();
	res.redirect('/');
});

app.listen(port, () => {
	console.log(port + ' hello');
});
