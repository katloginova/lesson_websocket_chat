'use strict';

const URL_SOCKET = 'wss://fep-app.herokuapp.com/';

const MESSAGE_BTN_CLASS = 'message__btn';

const inputMsg = document.querySelector('#inputMessage');
const messagesForm = document.querySelector('#messagesForm');

const messageElemTemplate = document.querySelector('#messageTemplate').innerHTML;
const loganElemTemplate = document.querySelector('#loganTemplate').innerHTML;

let socket = null;
let logan = null;
let userName = '';


messagesForm.addEventListener('click', onBtnSendClick);


initConnection(URL_SOCKET);


function onBtnSendClick(e) {
    e.preventDefault();

    switch (true) {
        case (e.target.classList.contains(MESSAGE_BTN_CLASS)):
            const message = inputMsg.value;
            const dataObj = makeDataObj(userName, message);

            send(dataObj);
            break;
    }

    resetInput(inputMsg);
}


function initConnection(url) {
    socket = new WebSocket(url);

    socket.onopen = () => {
        userName = getUserName();

        createLoganElem(userName);
    };

    socket.onmessage = (msg) => {
        const message = JSON.parse(msg.data);

        createMessageElem(message.payload.username, message.payload.message);
    };

    socket.onclose = () => {
        initConnection(url);
    };

    socket.onerror = (err) => {
        console.log('error message', err);
    };
}

function send(msg) {
    if (socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify(msg));
    }
}

function getUserName() {
    let name = '';

    do {
        name = prompt('What is your name?');
    } while (isEmptyStr(name));

    return name;
}

function isEmptyStr(str) {
    return str === '' || !str;
}

function createLoganElem(name) {
    const loganHtml = getLoganElemHtml(name);

    messagesForm.insertAdjacentHTML('beforebegin', loganHtml);
}

function getLoganElemHtml(name) {
    return loganElemTemplate
        .replace('{{name}}', name);
}

function createMessageElem(name, msg) {
    const msgHtml = getMessageElemHtml(name, msg);

    messagesForm.insertAdjacentHTML('afterbegin', msgHtml);
}

function getMessageElemHtml(name, msg) {
    return messageElemTemplate
        .replace('{{author}}', name)
        .replace('{{text}}', msg);
}


function makeDataObj(name, msg) {
    return {
        type: 'message',
        payload: {
            username: name,
            message: msg
        }
    };
}

function resetInput(inp) {
    inp.value = '';
}