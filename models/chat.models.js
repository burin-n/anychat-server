let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let chatSchema = new Schema({
  name:{
  	type: String,
  	default: 'Untitled'
  },
  members: [{}],
  state: {
  	type: {},
  	default: null
  },
  message: [{}],
});

mongoose.model('Chat',chatSchema);

/*
	members[i] = {
		id,
		name,
	}
*/
/*
	state = {
		id : {
			session,
			state,
			online
		}
	}
*/
/*
	message[i] = {
		userName,
		userId,
		message,
		time,
	}

*/
