var socket = io.connect('http://localhost:8080');
while (!pseudo) {
    var pseudo = prompt('Quel est ton nom ?');
}

socket.emit('pseudo', pseudo);
socket.emit('oldWhispers', pseudo);
document.title = pseudo + ' _ ' + document.title;

// connecter
socket.on('newUser', (pseudo) => {
    createElementFunction('newUser', pseudo);
});
// deconnecter

socket.on('quitUser', (pseudo) => {
    createElementFunction('quitUser', pseudo);
});
// envoyer le message saissi

document.getElementById('chatForm').addEventListener('submit', (e) => {

    e.preventDefault();
    const textInput = document.getElementById('msgInput').value;
    document.getElementById('msgInput').value = '';
    const receiver = document.getElementById('receiverInput').value;
    if (textInput.length > 0) {

        const receiver = document.getElementById('receiverInput').value;
        socket.emit('newMessage', textInput, receiver);
        if (receiver === 'all') {
            createElementFunction('newMessageMe', textInput);
        }



    } else {
        return false;
    }
});

// ecouter le message envoyer

socket.on('newMessageAll', (content) => {
    createElementFunction('newMessageAll', content);
});

socket.on('whisper', (content) => {
    createElementFunction('whisper', content);
});

socket.on('oldWhispers', (messages) => {
    messages.forEach(message => {
        createElementFunction('oldWhispers', message);
    })
})

socket.on('writting', (pseudo) => {

    document.getElementById('isWritting').textContent = pseudo + ' est entrain d\ecrire';
});

socket.on('notWritting', () => {
    document.getElementById('isWritting').textContent = '';
});

socket.on('oldMessages', (messages) => {
    messages.forEach(message => {

        if (message.sender === pseudo) {
            createElementFunction('oldMessagesMe', message);
        } else {
            createElementFunction('oldMessages', message);
        }

    });
});

function writting() {
    socket.emit('writting', pseudo);
}

function notWritting() {
    socket.emit('notWritting');
}

function createElementFunction(element, content) {
    const newElement = document.createElement('div');

    switch (element) {

        case 'newUser':
            newElement.classList.add(element, 'message');
            newElement.textContent = content + ' a rejoint le chat';
            document.getElementById('msgContainer').appendChild(newElement);
            break;

        case 'newMessageMe':
            newElement.classList.add(element, 'message');
            newElement.innerHTML = pseudo + ': ' + content;
            document.getElementById('msgContainer').appendChild(newElement);
            break;

        case 'newMessageAll':
            newElement.classList.add(element, 'message');
            newElement.innerHTML = content.pseudo + ': ' + content.message;
            document.getElementById('msgContainer').appendChild(newElement);
            break;
        case 'whisper':
            newElement.classList.add(element, 'message');
            newElement.innerHTML = content.sender + ': ' + content.message;
            document.getElementById('msgContainer').appendChild(newElement);
            break;

        case 'quitUser':
            newElement.classList.add(element, 'message');
            newElement.textContent = content + 'a quitté le chat';
            document.getElementById('msgContainer').appendChild(newElement);
            break;
        case 'oldMessages':
            newElement.classList.add(element, 'message');
            newElement.innerHTML = content.sender + ': ' + content.content;
            document.getElementById('msgContainer').appendChild(newElement);
            break;
        case 'oldMessagesMe':
            newElement.classList.add('newMessageMe', 'message');
            newElement.innerHTML = content.sender + ': ' + content.content;
            document.getElementById('msgContainer').appendChild(newElement);
            break;

        case 'oldWhispers':
            newElement.classList.add(element, 'message');
            newElement.innerHTML = content.sender + ' Vous a écrit : ' + content.content;
            document.getElementById('msgContainer').appendChild(newElement);
            break;



    }
}