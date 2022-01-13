import { Observer } from '@tangyansoft/toolkit-common';

class Socket extends Observer {
    constructor() {
        super();
        this.queue = [];
        this.state = '';
        this.count = 0;
        this.connect();
    }

    connect() {
        this.socket = new WebSocket("ws://127.0.0.1:3000");
        this.socket.addEventListener('open', () => {
            this.state = 'open';
            this.queue.forEach(item => {
                let [type, data] = item;
                this.socket.send(JSON.stringify({ type, data }));
            });
        });
        this.socket.addEventListener('message', (event) => {
            let res = JSON.parse(event.data)
            this.emit(res.type, res);
        });
        this.socket.addEventListener('close', () => {
            this.state = 'close';
        });
        this.socket.addEventListener('error', () => {
            this.state = 'error';
            this.count++;
            this.count < 3 && this.connect();
        });
    }

    send(type, data) {
        return new Promise(resolve => {
            this.once(type, (data) => { resolve(data); });
            if (this.state === 'open') {
                this.socket.send(JSON.stringify({ type, data }));
            } else {
                this.queue.push([type, data]);
            }
        });
    }
};

const socket = new Socket();

export default socket;