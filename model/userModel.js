const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
	Username: {
		type: String,
		require: true,
	},
	Email: {
		type: String,
		require: true,
	},
	DoB: {
		type: Date,
		// default: Date.now(),
	},
	Password: {
		type: String,
		require: true,
	},
});
UserSchema.pre('save', async function (next) {
	const hash = await bcrypt.hash(this.Password, 10);
	this.Password = hash;
	next();
});
UserSchema.methods.isValidPassword = async function (password) {
	const comparePassword = await bcrypt.compare(password, this.Password);
	return comparePassword;
};
const UserModel = mongoose.model('user', UserSchema);
module.exports = UserModel;
