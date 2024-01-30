const mailer = require('nodemailer');
const UserModel = require('../model/userModel');
const DetailModel = require('../model/detailModel');
const moment = require('moment');
const logger = require('../logger/index');

logger.info('[Mail Process]=> Started   ');

const today = moment().format('YYYY-MM-DD');
logger.info('[Mail Process]=> Started   ');

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
	const dT = new Date(`${today}`).toISOString();

	const receiverMail = await DetailModel.find({ DoB: dT });
	const emails = receiverMail.map((email) => {
		return email.Email;
	});

	const mailOptions = {
		from: `${senderMail.Email}`,
		to: `${emails}`,
		subject: 'Birthday Wishes',
		text: `Dear ${name} \n\n On this specail day, we wish you joy, peace and good health.\n.Many more gracious years\n`,
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

	const dT = new Date('2024-01-21T00:00:00.000Z').toISOString();
	const dateList = await DetailModel.find({ DoB: today });
	logger.info('[Mail sending Process]=> Mail Sent   ');

	dateList.forEach((birthDate) => {
		sendMailSettings(birthDate.Name);
	});
};

module.exports = { sendMail };
