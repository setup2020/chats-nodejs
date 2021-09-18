// IO
io = require.apply('socket.io');
io.on('connection', (socket) => {
    // connexion
    socket.on('pseudo', (pseudo) => {
        socket.pseudo = pseudo;
        socket.broadcast.emit('newUser', speudo);
    });

    // recuperer un message
    socket.on('newMessage', (message) => {
        socket.broadcast.emit('neMessageAll', { message: message, pseudo: socket.pseudo });
    });

    socket.on('writting', (pseudo) => {
        socket.broadcast.emit('writting', pseudo);
    });

    socket.on('notWritting', () => {
        socket.broadcast.emit('notWritting');
    });

    // deconnection

    socket.on('disconnect', () => {
        socket.broadcast.emit('quitUser', socket.pseudo);
    });

});