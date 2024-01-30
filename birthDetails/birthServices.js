const BirthModel = require('../model/detailModel');
const logger = require('../logger/index');

logger.info('[Create Birth details Process]=> started    ');

const createBDdetails = async ({ Name, Email, DoB, user_id }) => {
	try {
		const reqBody = { Name, Email, DoB, user_id };
		const findDetail = await BirthModel.findOne({
			Email: reqBody.Email,
			Name: reqBody.Name,
		});
		if (findDetail) {
			logger.info('[Create Birth details Process]=> Detail Exist    ');

			return {
				massage: 'Detail Exist',
				code: 409,
			};
		}
		const BD_details = await BirthModel.create({
			Name: reqBody.Name,
			Email: reqBody.Email,
			DoB: reqBody.DoB,
			user_id,
		});
		logger.info('[Create Birth details Process]=> completed    ');

		return {
			massage: 'Birth Detalis Created',
			code: 201,
			data: { BD_details },
		};
	} catch (error) {
		logger.info('[Create Birth details Process]=> Server Error    ');

		return {
			massage: 'Server Error',
			code: 500,
		};
	}
};

module.exports = { createBDdetails };
