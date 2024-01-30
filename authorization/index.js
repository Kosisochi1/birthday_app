const UserModel = require('../model/userModel');
const jwt = require('jsonwebtoken');
require('dotenv').config({ path: __dirname + '/./../../.env' });
const logger = require('../logger/index');

const authenticateUser = async (req, res, next) => {
	logger.info('[Initialize Headers]=> authHeader');

	const authHeaders = req.headers;
	try {
		if (!authHeaders) {
			logger.info('[Initialize Headers]=> No headers');

			return res.status(401).json({
				massage: 'You are not Authorized',
			});
		}
		logger.info('[Headers]=> Get token and Verify users');

		const token = authHeaders.authorization.split(' ')[1];
		const verifyToken = await jwt.verify(token, process.env.SECRETE_KEY);

		logger.info('[Check ]=>if User  is the database ');

		const verifyUser = await UserModel.findOne({
			Email: verifyToken.Email,
			_id: verifyToken._id,
		});
		if (!verifyUser) {
			logger.info('[Check ]=> No user Found ');

			return res.status(401).json({
				massage: 'You are not Authorized',
			});
		}
		logger.info('[Check ]=> user verified ');

		req.userExist = { user_id: verifyToken._id };
		next();
	} catch (error) {
		logger.info('[Check ]=> Authentication server Error ');

		return res.status(500).json({
			massage: 'Server error',
		});
	}
};
const authenticate = async (req, res, next) => {
	logger.info('[check]=> Available  Cookies  ');

	const token = req.cookies.jwt;
	if (token) {
		logger.info('[Cookies]=> Available    ');

		try {
			logger.info('[Auth Process]=> started    ');

			const decodeValue = await jwt.verify(token, process.env.SECRETE_KEY);
			res.locals.loginUser = decodeValue;
			logger.info('[Auth Process]=> completed    ');

			next();
		} catch (error) {
			logger.info('[Auth Process]=> Server Error    ');

			return res.status(500).json({
				massage: 'Server',
			});
		}
	}
};

module.exports = { authenticateUser, authenticate };
