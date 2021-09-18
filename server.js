var express = require('express');
var app = express();
server = require('http').Server(app);
var mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

mongoose.connect("mongodb://localhost:27017/ChatSocket", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}, (err) => {
    if (err) {
        console.lo('================>', err)
    } else {
        console.log('Connected to mongoodb');
    }
});

require('./models/chat.model');
require('./models/user.model');
require('./models/room.model');

var User = mongoose.model('user');
var Chat = mongoose.model('chat');
var Room = mongoose.model('room');

app.use(express.static(__dirname + '/public'));
//ROUTER
app.get('/', (req, res) => {

    User.find((err, users) => {
        res.render('index.ejs', { users: users });
    })



});

app.use((req, res, next) => {
    res.setHeader - ('Content-type', 'text/html');
    res.status(404).send('Page introuvable');
});

// IO
// var io = require('socket.io').listen(server);
// IO
var io = require('socket.io')(server);
var connectedUsers = [];
io.on('connection', (socket) => {


    // connexion
    socket.on('pseudo', (pseudo) => {
        User.findOne({ pseudo: pseudo }, (err, user) => {
            if (user) {
                socket.pseudo = pseudo;
                socket.broadcast.emit('newUser', pseudo);
            } else {
                var user = new User();
                user.pseudo = pseudo;
                user.save();
                socket.pseudo = pseudo;
                socket.broadcast.emit('newUser', pseudo);
            }

            connectedUsers.push(socket);



            Chat.find({ receiver: 'all' }, (err, messages) => {
                socket.emit('oldMessages', messages);
            });
        });

    });
    socket.on('oldWhispers', (pseudo) => {
        Chat.find({ receiver: pseudo }, (err, messages) => {
            if (err) {
                return false;
            } else {
                socket.emit('oldWhispers', messages);
            }
        }).limit(3);
    })

    // recuperer un message
    socket.on('newMessage', (message, receiver) => {
        if (receiver === 'all') {
            var chat = new Chat();
            chat.content = message;
            chat.sender = socket.pseudo;
            chat.receiver = 'all';
            chat.save();
            socket.broadcast.emit('newMessageAll', { message: message, pseudo: socket.pseudo });
        } else {

            User.findOne({ pseudo: receiver }, (err, user) => {
                if (!user) {
                    return false;
                } else {


                    socketDuReceiver = connectedUsers.find(socket => socket.pseudo === user.pseudo);

                    if (socketDuReceiver) {
                        socketDuReceiver.emit('whisper', { sender: user.pseudo, message: message });
                    }

                    var chat = new Chat();
                    chat.content = message;
                    chat.sender = socket.pseudo;
                    chat.receiver = receiver;
                    chat.save();
                }
            });

        }

    });

    socket.on('writting', (pseudo) => {
        socket.broadcast.emit('writting', pseudo);
    });

    socket.on('notWritting', () => {
        socket.broadcast.emit('notWritting');
    });

    // deconnection

    socket.on('disconnect', () => {
        var index = connectedUsers.indexOf(socket);
        if (index > -1) {
            connectedUsers.splice(index, 1);
        }
        socket.broadcast.emit('quitUser', socket.pseudo);

    });

});

server.listen(8080, () => console.log('Server strated at port :8080'));