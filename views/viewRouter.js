const express = require('express');
const controller = require('../user/userService');
const { getQuote } = require('inspirational-quotes');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const { authenticate, authenticateUser } = require('../authorization/index');
const upCominBDays = require('../utility/birthday');
const birth_details = require('../birthDetails/birthServices');

const router = express.Router();
router.use(cookieParser());

// signup
router.get('/signup', (req, res) => {
	res.render('signup', { loginUser: res.locals.loginUser || null });
});

router.get('/index', async (req, res) => {
	quote = getQuote();
	res.render('index', {
		loginUser: res.locals.loginUser || null,
		quotes: ` "${quote.text}" `,
	});
});

router.post('/signup', async (req, res) => {
	console.log(req.body);
	const response = await controller.createUser({
		Username: req.body.Username,
		DoB: req.body.DoB,
		Email: req.body.Email,
		Password: req.body.Password,
	});
	if (response.code == 201) {
		res.render('index', {
			loginUser: res.locals.loginUser || null,
			quotes: ` "${quote.text}" `,
		});
	} else if (response.code == 409) {
		res.render('user_exist', { loginUser: res.locals.loginUser || null });
	} else {
		res.render('error', { loginUser: res.locals.loginUser || null });
	}
});
// login Section
router.get('/login', (req, res) => {
	res.render('login', { loginUser: res.locals.loginUser || null });
});
router.post('/login', async (req, res) => {
	const response = await controller.loginUser({
		Email: req.body.email,
		Password: req.body.password,
	});
	if (response.code === 200) {
		res.cookie('jwt', response.data.token, { maxAge: 60 * 60 * 1000 });
		res.redirect('home');
	} else if (response.code == 404) {
		res.render('404', { loginUser: res.locals.loginUser || null });
	} else if (response.code == 422) {
		res.render('wrongDetails', { loginUser: res.locals.loginUser || null });
	} else {
		res.render('error', { loginUser: res.locals.loginUser || null });
	}
});
//Home route
router.get('/home', authenticate, async (req, res) => {
	console.log(res.locals.loginUser._id);
	quote = getQuote();

	const getUpComingBD = await upCominBDays.checkUpComingBD({
		user_id: res.locals.loginUser._id,
	});

	if (getUpComingBD.data.totalDoc <= 0) {
		res.render('no_birthDay', {
			quotes: ` "${quote.text}" `,

			checkUpComingBD: getUpComingBD.data.checkBirthday,
		});
	}
	res.render('home', {
		quotes: ` "${quote.text}" `,
		checkUpComingBD: getUpComingBD.data.checkBirthday,
	});
});
//Root directory
router.get('/', async (req, res) => {
	quote = getQuote({ author: false });
	//
	res.render('index', {
		loginUser: res.locals.loginUser || null,
		quotes: ` "${quote.text}" `,
	});
});
//Create Birthday Details
router.get('/addDetails', authenticate, (req, res) => {
	res.render('birthDayDetails', { loginUser: res.locals.loginUser });
});
router.post('/addDetails', authenticate, async (req, res) => {
	quote = getQuote();

	const response = await birth_details.createBDdetails({
		Name: req.body.Name,
		Email: req.body.Email,
		DoB: req.body.DoB,
		user_id: res.locals.loginUser._id,
	});
	console.log(response);
	if (response.code === 201) {
		res.redirect('home');
	} else if (response.code === 409) {
		res.render('detail_exist', { loginUser: res.locals.loginUser || null });
	}
});
// Logout Route
router.get('/logout', (req, res) => {
	res.clearCookie('jwt');
	res.redirect('/');
});

module.exports = router;
