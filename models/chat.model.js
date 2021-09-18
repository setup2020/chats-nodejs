const mongoose = require('mongoose');
var chatScheama = new mongoose.Schema({
    _id_room: {
        type: String
    },
    sender: String,
    receiver: String,
    content: String
});

mongoose.model('chat', chatScheama);