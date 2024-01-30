const express = require('express');
const controller = require('./birthController');
const middleWare = require('./birthMiddleWare');
const authenticateUser = require('../authorization/index');

const router = express.Router();

router.post(
	'/birthday_detail',
	authenticateUser.authenticateUser,
	middleWare.validateDetails,
	controller.createBDdetails
);
module.exports = router;
