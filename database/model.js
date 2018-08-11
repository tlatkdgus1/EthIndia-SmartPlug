var mongoose = require('mongoose');
var Schema = mongoose.Schema;

exports.UserSchema = new Schema({
	user_id: String,
	user_pass: String,
	user_email: String,
	user_coin: Number,
	session: String,
});

exports.DeviceSchema = new Schema({
	user_id: String,
	serial_number: String,
	usage: Number,
	sc_addr: String,
});

exports.IpfsSchema = new Schema({
	user_id: String,
	serial_number: String,
	date: String,
	ipfs_hash: String, 
});
