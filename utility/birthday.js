const detailModel = require('../model/detailModel');
const cron = require('node-cron');
const logger = require('../logger/index');

const moment = require('moment');

const checkUpComingBD = async ({ user_id }) => {
	logger.info('[Upcoming Birthday check Process]=> Started   ');

	const today = moment();
	const daysBack = today.add(1, 'days').format('YYYY-MM-DD');

	const checkBirthday = await detailModel.find({
		user_id: user_id,
		DoB: daysBack,
	});
	logger.info('[Upcoming Birthday check Process]=> Completed   ');

	return {
		massage: 'DoB',
		code: 200,
		data: {
			checkBirthday,
			totalDoc: checkBirthday.length,
		},
	};
};

module.exports = { checkUpComingBD };
