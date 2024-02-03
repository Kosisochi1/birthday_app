require('dotenv').config();
const express = require('express');
const db = require('./db');
const logger = require('./logger/index');
const route = require('./user/userRoute');
const viewRoute = require('./views/viewRouter');
const quote = require('inspirational-quotes');
const cron = require('node-cron');
const BD = require('./utility/birthday');
const SM = require('./utility/sendBirthdayWish');
const Birthday_detail_router = require('./birthDetails/birthRouter');
const authorization = require('./authorization/index');

PORT = process.env.PORT;

const app = express();
app.use('/public', express.static('public'));

app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/user', route);
app.use('/v1', Birthday_detail_router);
app.use('/', viewRoute);

// app.get('/bd', authorization.authenticate, BD.checkUpComingBD);

// SM.sendMail();
// cron.schedule('0 1 * * *', BD.checkUpComingBD);
cron.schedule('0 7 * * *', SM.sendMail);

app.get('*', (req, res) => {
	res.status(404).json({
		data: null,
		massage: 'Route Not Found',
	});
});

app.use((err, req, res, next) => {
	res.status(500).json({
		data: null,
		error: err.stack,
	});
});

db.connect();
app.listen(PORT, () => {
	logger.info('[Server]=> Started');
});
