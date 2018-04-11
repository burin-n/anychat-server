let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let userSchema = Schema({
	name: String,
	password: String,
	chats: [Schema.Types.ObjectId]
})

mongoose.model('User',chatSchema);
// chats list of group chat'id