// require('dotenv').config({ debug: true, override: true });
const mongoose = require('mongoose');
const logger = require('../logger/index');
require('dotenv').config({ path: __dirname + '/./../../.env' });

const connect = async (url) => {
	mongoose.connect(url || process.env.DB_URL);
	mongoose.connection.on('connected', () => {
		logger.info('[Database]=> Connected');
		console.log('DB Started');
	});
	mongoose.connection.on('error', (err) => {
		logger.info('[Database]=>  Error occoured Connection');
	});
};

module.exports = { connect };
