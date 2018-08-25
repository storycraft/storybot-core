import Client from "./client";
import http from 'http';

export default class WebClient extends Client {
    constructor() {
        super();

        this.port = 0;

        this.server = null;
        this.handler = new WebHandler(this);

        this.channelMap = new Map();
    }

    get Port(){
        return this.port;
    }

    get Handler(){
        return this.handler;
    }

    get Server(){
        return this.server;
    }

    async initialize(port){
        if (this.Ready || this.Initializing)
            throw new Error('해당 클라이언트는 이미 활성화 되어있거나 초기화 중입니다');
        this.initializing = true;
        
        this.port = port || 7000;
        this.server = http.createServer(this.Handler.handleConnection.bind(this.Handler));
        this.server.listen(this.port);

        this.initializing = false;
        this.ready = true;
    }

    async createChannel(name){
        
    }


    async sendMessage(msgTemplate){

    }

    async destroy(){
        
    }
}

/*
{
    "channel": {
        "id": 182739123,
        "name": "asdf"
    },
    "user": {
        "id": 178293671283,
        "nickname": "asdf" 
    },
    "message": {
        "attachments": [],
        "text": "asdf"
    }
}
*/
export class WebHandler {
    constructor(webClient) {
        this.webClient = webClient;
    }

    get WebClient(){
        return this.webClient;
    }

    async handleConnection(req, res) {
        let data = await new Promise((resolve, reject) => {
            let data = '';
            res.on('data', (chunk) => {
                data += chunk;
            });
    
            res.on('end', () => {
                resolve(data);
            });
        });

        var json = {};
        try {
            json = JSON.parse(data);
        } catch(e) {
            res.setHeader('Content-Type', 'application/json');
        }


        res.setHeader('Content-Type', 'application/json');
    }
}