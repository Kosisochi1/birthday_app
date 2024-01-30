const express = require('express');
const controller = require('./userController');
const middleWare = require('./userMiddleware');
const authenticateUser = require('../authorization/index');

const route = express.Router();

route.post('/v1/signup', middleWare.validateUser, controller.createUser);
route.post(
	'/v1/login',
	middleWare.validateLogin,
	authenticateUser.authenticateUser,
	controller.loginUser
);

module.exports = route;
