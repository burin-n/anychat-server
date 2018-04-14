let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let userSchema = Schema({
	username: {
		type: String,
		require: true,
		unique: true,
		trim: true
	},
	name: String,
	password: String,
	chats: [Schema.Types.ObjectId]
})

mongoose.model('User',userSchema);
// chats list of group chat'id
