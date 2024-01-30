const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const DetailSchema = new Schema({
	Name: {
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
	user_id: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'user',
	},
});
const BirthDetailModel = mongoose.model('details', DetailSchema);
module.exports = BirthDetailModel;
