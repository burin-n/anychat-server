let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let chatSchema = new Schema({
  name:    String,
  chatId:  String,
  members: [{}],
})

mongoose.model('Chat',chatSchema);
// members[i].id
// members[i].name
// members[i].state
// members[i].session