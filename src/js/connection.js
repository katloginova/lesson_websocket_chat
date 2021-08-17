'use strict';

const URL_SOCKET = 'wss://fep-app.herokuapp.com/';

let socket = null;


export function initConnection(config) {
    socket = new WebSocket(URL_SOCKET);

    socket.onopen = () => {
        console.log('connect');
    };

    socket.onmessage = (msg) => {
        config.onMessage(JSON.parse(msg.data));
    };

    socket.onclose = () => {
        initConnection(config);
    };

    socket.onerror = (err) => {
        console.log('error message', err);
    };
}

export function send(name, msg) {
    if (socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify({
            type: 'message',
            payload: {
                username: name,
                message: msg
            }
        }));
    }
}