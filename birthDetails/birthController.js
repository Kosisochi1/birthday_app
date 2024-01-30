const BirthModel = require('../model/detailModel');
const { createUser } = require('../user/userController');
const logger = require('../logger/index');

const createBDdetails = async (req, res) => {
	logger.info('[Create Birth details Process]=> started    ');

	const reqBody = req.body;
	console.log(req.userExist);
	const BD_details = await BirthModel.create({
		Name: reqBody.Name,
		Email: reqBody.Email,
		DoB: reqBody.DoB,
		user_id: req.userExist.user_id,
	});
	logger.info('[Create Birth details Process]=> completed    ');

	res.status(201).json({
		massage: 'Birth Detalis Created',
		data: { BD_details },
	});
};

module.exports = { createBDdetails };
