'use strict';

import {initConnection, send} from './connection';
import '../css/style.css';

const MESSAGE_BTN_CLASS = 'message__btn';

const messagesForm = document.querySelector('#messagesForm');
const inputName = document.querySelector('#inputName');
const inputMsg = document.querySelector('#inputMessage');

const messageElemTemplate = document.querySelector('#messageTemplate').innerHTML;


initConnection({
    onMessage: addMessage
});

messagesForm.addEventListener('click', onBtnSendClick);


function onBtnSendClick(e) {
    e.preventDefault();

    switch (true) {
        case (e.target.classList.contains(MESSAGE_BTN_CLASS)):
            const name = inputName.value;
            const message = inputMsg.value;

            send(name, message);
            break;
    }

    resetInput(inputMsg);
}

function resetInput(inp) {
    inp.value = '';
}

function addMessage({payload}) {
    const msgHtml = getMessageHtml(payload.username, payload.message);

    messagesForm.insertAdjacentHTML('afterbegin', msgHtml);
}

function getMessageHtml(name, msg) {
    return messageElemTemplate
        .replace('{{author}}', name)
        .replace('{{text}}', msg);
}