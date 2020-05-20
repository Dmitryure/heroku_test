const mongoose = require('mongoose');
require('dotenv').config();
console.log(process.env.ADMIN_PASSWORD);

const connection_url = `mongodb+srv://admin:${process.env
	.ADMIN_PASSWORD}@cluster0-ssdlc.gcp.mongodb.net/test?retryWrites=true&w=majority`;

mongoose.connect(connection_url, {
	useNewUrlParser: true,
	useUnifiedTopology: true
});

const userSchema = new mongoose.Schema({
	username: { type: String, unique: true, required: true },
	password: { type: String, required: true }
});

module.exports = mongoose.model('User', userSchema);
