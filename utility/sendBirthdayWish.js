const mailer = require('nodemailer');
const UserModel = require('../model/userModel');
const DetailModel = require('../model/detailModel');
const moment = require('moment');
const logger = require('../logger/index');

logger.info('[Mail Process]=> Started   ');

const today = moment();
var dayOfMonth = today.date();
var monthValue = today.month() + 1;
const transporter = mailer.createTransport({
	service: 'gmail',
	auth: {
		user: 'ezeoyiri92@gmail.com',
		pass: 'khinabtyliknfezg',
	},
});
logger.info('[Mail Process]=> Started   ');

const sendMailSettings = async (name) => {
	logger.info('[Mail setting Process]=> Started   ');

	const senderMail = await UserModel.find({});

	const receiverMail = await DetailModel.find({
		$expr: {
			$and: [
				{ $eq: [{ $dayOfMonth: '$DoB' }, dayOfMonth] },
				{ $eq: [{ $month: '$DoB' }, monthValue] },
			],
		},
	});
	const emails = receiverMail.map((email) => {
		return email.Email;
	});

	const mailOptions = {
		from: `${senderMail.Email}`,
		to: `${emails}`,
		subject: 'Birthday Wishes',
		text: `Dear ${name} \n\n On this specail day, we wish you joy, peace and good health.\n.Many more gracious years\n. Enjoy your day!!!`,
	};
	transporter.sendMail(mailOptions, (error, info) => {
		if (error) {
			console.log('Error sending mail', error);
		} else {
			console.log('Email sent ', info.response);
		}
	});
};
logger.info('[Mail setting Process]=> Ended   ');

const sendMail = async (req, res) => {
	logger.info('[Mail sending Process]=> Started   ');

	const dateList = await DetailModel.find({
		$expr: {
			$and: [
				{ $eq: [{ $dayOfMonth: '$DoB' }, dayOfMonth] },
				{ $eq: [{ $month: '$DoB' }, monthValue] },
			],
		},
	});
	logger.info('[Mail sending Process]=> Mail Sent   ');

	dateList.forEach((birthDate) => {
		sendMailSettings(birthDate.Name);
	});
};

module.exports = { sendMail };
