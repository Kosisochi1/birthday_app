const joi = require('joi');
const logger = require('../logger/index');

const validateUser = async (req, res, next) => {
	logger.info('[User Validation Process]=> Started   ');

	try {
		const schema = joi.object({
			Username: joi.string().required(),
			Email: joi.string().required(),
			DoB: joi.date().iso(),
			Password: joi.string(),
		});
		await schema.validateAsync(req.body, { abortEarly: true });
		logger.info('[User Validation Process]=> Completed   ');

		next();
	} catch (error) {
		logger.info('[User Validation Process]=> Server Error   ');

		return res.status(422).json({
			massage: error.stack,
			success: false,
		});
	}
};

const validateLogin = async (req, res, next) => {
	logger.info('[Login Validation Process]=> Started   ');

	try {
		const schema = joi.object({
			Email: joi.string().required(),
			Password: joi.string(),
		});
		await schema.validateAsync(req.body, { abortEarly: true });
		logger.info('[Login Validation Process]=> Completed   ');

		next();
	} catch (error) {
		logger.info('[Login Validation Process]=> Server Error   ');

		return res.status(422).json({
			massage: error.stack,
			success: false,
		});
	}
};

module.exports = { validateUser, validateLogin };
