const joi = require('joi');
const logger = require('../logger/index');

const validateDetails = async (req, res, next) => {
	try {
		logger.info('[validation Process]=> started    ');

		const schema = joi.object({
			Name: joi.string().required(),
			Email: joi.string().required(),
			DoB: joi.date().iso(),
		});
		await schema.validateAsync(req.body, { abortEarly: true });
		logger.info('[validation Process]=> completed    ');

		next();
	} catch (error) {
		logger.info('[validation Process]=> Server Error    ');

		return res.status(422).json({
			massage: error.stack,
			success: false,
		});
	}
};

module.exports = { validateDetails };
