require('dotenv').config({ path: __dirname + '/./../../.env' });

const UserModel = require('../model/userModel');
const jwt = require('jsonwebtoken');
const logger = require('../logger/index');

const createUser = async (req, res) => {
	logger.info('[User Validation Process]=> Started   ');

	const { Email, Username, DoB, Password } = req.body;

	try {
		const checkUser = await UserModel.findOne({
			Email: Email,
		});
		if (checkUser) {
			logger.info('[User Process]=> User Exist   ');

			return res.status(409).json({
				massage: 'User Exist ',
			});
		}
		const newUser = await UserModel.create({
			Username: Username,
			Email: Email,
			DoB: DoB,
			Password: Password,
		});
		const token = await jwt.sign(
			{ Email: newUser.Email, _id: newUser._id },
			process.env.SECRETE_KEY
		);
		logger.info('[User Process]=> Completed   ');

		return res.status(201).json({
			massage: 'User Created',
			data: { token, newUser },
		});
	} catch (error) {
		logger.info('[User Process]=> Server Error   ');

		return res.status(500).json({
			data: null,
			massage: ' Server error',
		});
	}
};
const loginUser = async (req, res) => {
	logger.info('[Login Process]=> Started   ');

	const { Email, Password } = req.body;
	try {
		const checkUser = await UserModel.findOne({ Email: Email });
		if (!checkUser) {
			logger.info('[Login Process]=> No matched User   ');

			return res.status(404).json({
				massage: 'No User Matched',
			});
		}
		logger.info('[Login Process]=> User Validation Started   ');

		const validateUser = await checkUser.isValidPassword(Password);
		if (!validateUser) {
			logger.info('[Login Process]=>  Incorrect password or email  ');

			return res.status(422).json({
				massage: 'Incorrect password or email',
			});
		}
		logger.info('[Login Process]=> sign token   ');

		const token = await jwt.sign(
			{ Email: checkUser.Email, _id: checkUser._id },
			process.env.SECRETE_KEY,
			{ expiresIn: '1h' }
		);
		logger.info('[Login Process]=> Completed   ');

		return res.status(200).json({
			massage: 'Login Successful',
			data: {
				token,
				checkUser,
			},
		});
	} catch (error) {
		logger.info('[Login Process]=> Server Error   ');

		return res.status(500).json({
			data: null,
			massage: 'Server error',
		});
	}
};

module.exports = {
	createUser,
	loginUser,
};
