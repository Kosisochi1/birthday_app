require('dotenv').config({ path: __dirname + '/./../../.env' });
const logger = require('../logger/index');

const UserModel = require('../model/userModel');
const jwt = require('jsonwebtoken');

const createUser = async ({ Username, Email, DoB, Password }) => {
	logger.info('[User Validation Process]=> Started   ');

	const reqBody = { Username, DoB, Email, Password };

	try {
		const checkUser = await UserModel.findOne({
			Email: reqBody.Email,
		});
		if (checkUser) {
			logger.info('[User Process]=> User Exist   ');

			return {
				massage: 'User Exist ',
				code: 409,
			};
		}
		const newUser = await UserModel.create({
			Username: reqBody.Username,
			DoB: reqBody.DoB,
			Email: reqBody.Email,
			Password: reqBody.Password,
		});
		const token = await jwt.sign(
			{ Email: newUser.Email, _id: newUser._id },
			process.env.SECRETE_KEY
		);
		logger.info('[User Process]=> Completed   ');

		return {
			massage: 'User Created',
			code: 201,
			data: {
				token,
				newUser,
			},
		};
	} catch (error) {
		logger.info('[User Process]=> Server Error   ');

		return {
			data: null,
			code: 500,
			massage: ' Server error',
		};
	}
};
const loginUser = async ({ Email, Password }) => {
	const reqBody = { Email, Password };
	try {
		const checkUser = await UserModel.findOne({ Email: reqBody.Email });
		if (!checkUser) {
			return {
				massage: 'No User Matched',
				code: 404,
			};
		}
		const validateUser = await checkUser.isValidPassword(reqBody.Password);
		if (!validateUser) {
			return {
				massage: 'Incorrect password or email',
				code: 422,
			};
		}
		const token = await jwt.sign(
			{ Email: checkUser.Email, _id: checkUser._id },
			process.env.SECRETE_KEY,
			{ expiresIn: '1h' }
		);
		return {
			data: { token, checkUser },
			code: 200,
			massage: ' Login Successful',
		};
	} catch (error) {
		return {
			data: null,
			code: 500,
			massage: ' Server error',
		};
	}
};

module.exports = {
	createUser,
	loginUser,
};
