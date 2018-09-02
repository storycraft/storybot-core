import Client, { ClientUser } from "./client";
import http from 'http';
import SocketServer from "socket.io";
import WebChannel from "../channel/web-channel";
import { EventEmitter } from "events";
import WebMessage from "../message/web-message";
import WebUser from "../user/web-user";

export default class WebClient extends Client {
    constructor() {
        super();

        this.port = 0;

        this.httpServer = null;
        this.server = null;
        this.handler = new WebHandler(this);

        this.socketMap = new Map();
        this.user = new WebClientUser(this);
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

    addSocketHandler(socket) {
        if (this.hasSocketHandler(socket))
            return this.getSocketHandler(socket);

        var handler = new SocketHandler(this, socket);
        this.socketMap.set(socket.id, handler);
        
        return handler;
    }

    hasSocketHandler(socket) {
        return this.socketMap.has(socket.id);
    }

    getSocketHandler(socket) {
        if (!this.hasSocketHandler(socket))
            return null;

        return this.socketMap.get(socket.id);
    }

    removeSocketHandler(socket) {
        if (!this.hasSocketHandler(socket))
            return false;

        this.socketMap.delete(socket.id);

        return true;
    }

    async initialize(port){
        if (this.Ready || this.Initializing)
            throw new Error('해당 클라이언트는 이미 활성화 되어있거나 초기화 중입니다');
        this.initializing = true;
        
        this.port = port || 7000;
        this.httpServer = http.createServer();
        this.server = new SocketServer(this.httpServer, {
            path: WebClient.DEFAULTPATH,
            serveClient: false
        });
        this.httpServer.listen(this.port);

        await this.handler.initialize();

        this.initializing = false;
        this.ready = true;

        console.log(`Web 클라이언트가 포트 ${this.port} 로 초기화 되었습니다`);

        return this.server;
    }

    async createChannel(name){
        
    }

    async sendMessage(msgTemplate){
        var taskList = [];

        for (let [id, socket] of this.socketMap.entries()) {
            taskList.push(socket.sendMessage(msgTemplate));
        }

        await Promise.all(taskList);
    }

    async destroy(){
        
    }
}
WebClient.DEFAULTPATH = '/storybot-web';

export class WebClientUser extends ClientUser {
    get Id(){
        return -1;
    }

    //클라이언트간 구분 가능한 Id
    get IdentityId(){
        return "web:" + this.Id;
    }

    get Name(){
        return 'Storybot';
    }

    get HasDMChannel(){
        return false;
    }
}

export class WebHandler {
    constructor(webClient) {
        this.webClient = webClient;
    }

    get WebClient(){
        return this.webClient;
    }

    get SocketServer(){
        return this.WebClient.Server;
    }

    get BotSocket() {
        return this.SocketServer.sockets;
    }

    async initialize() {
        this.BotSocket.on('connect', this.onConnected.bind(this));
    }

    onConnected(socket) {
        console.log(socket.id + " is connected to storybot");

        var handler = this.WebClient.addSocketHandler(socket);

        /*
        {
            "namespace": "asdf",
            "service": "kakao bot",
            "id": 8176289391423 <- this is unique id
        }
        */
        socket.on('initialize', (jsonData) => {
            try {
                if (!handler.Initialized) {
                    handler.initialize(jsonData.namespace, jsonData.service);

                    console.log(`socket ${socket.id} is initialized to namespace: ${handler.Namespace}, service: ${handler.ServiceDesc}`);
                }
                else {
                    throw new Error("Handler already initialized?!");
                }
            } catch (e) {
                console.log(`Error while initializing from ${socket.id}: ${e}`);
            }
        });
    }
}

export class SocketHandler extends EventEmitter {
    constructor(webClient, socket, namespace) {
        super();
        this.webClient = webClient;
        this.socket = socket;

        this.namespace = null;
        this.serviceDesc = null;
        this.initialized = false;

        this.channelMap = new Map();
        this.userMap = new Map();

        this.socket.on('message', this.onMessage.bind(this));
        this.socket.on('disconnect', this.onDisconnect.bind(this));
    }

    get Socket(){
        return this.socket;
    }

    get Initialized() {
        return this.initialized;
    }

    get Namespace() {
        return this.namespace;
    }

    get ServiceDesc() {
        return this.serviceDesc;
    }

    get WebClient() {
        return this.webClient;
    }

    initialize(namespace, serviceDesc) {
        this.namespace = namespace;
        this.serviceDesc = serviceDesc;

        this.initialized = true;
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
        "timestamp": 12897682391,
        "attachments": [
            {"type": "image", "url": "asdf"}
        ],
        "text": "asdf"
    }
}
*/
    onMessage(jsonData) {
        if (!this.Initialized) {
            return;
        }

        try {
            var rawChannel = jsonData.channel;
            var rawUser = jsonData.user;
            var rawMessage = jsonData.message;

            var user = this.getWrappedUser(rawUser.id);

            var channel = null;
            if (this.hasChannel(rawChannel.id)) {
                channel = this.getChannel(rawChannel.id);
            }
            else {
                channel = this.addChannel(rawChannel.id);
            }

            if (rawMessage.text) {
                var message = new WebMessage(rawMessage.text, rawMessage.timestamp, channel, user);

                this.emit('message', message);
                this.WebClient.emit('message', message);
                channel.emit('message', message);
                user.emit('message', message);
            }

            for (var attachment of rawMessage.attachments) {
                var message = new WebMessage('', rawMessage.timestamp, channel, user);

                this.emit('message', message);
                this.WebClient.emit('message', message);
                channel.emit('message', message);
                user.emit('message', message);
            }

        } catch (e) {
            console.log(`Error on parsing message from socket ${this.Socket.id}. ${e}`);
        }
    }

    /*
    {
        "channel": 81728497923,
        "attachments": [],
        "text": "asdf"
    }
    */
    async sendMessage(msgTemplate, channel) {
        if (channel) {
            return channel.sendMessage(msgTemplate);
        }
        else {
            var messageList = [];

            for (let [id, channel] of this.channelMap) {
                var messages = await channel.sendMessage(msgTemplate);

                for (let message of messages) {
                    messageList.push(message);
                }
            }

            return messageList;
        }
    }

    addChannel(channelId) {
        if (this.hasChannel(channelId))
            return this.getChannel(channelId);
            
        var webChannel = new WebChannel(this.WebClient, this, channelId, "Unknown");

        this.channelMap.set(channelId, webChannel);

        return webChannel;
    }

    getChannel(channelId) {
        if (!this.hasChannel(channelId))
            return null;

        return this.channelMap.get(channelId);
    }

    hasChannel(channelId) {
        return this.channelMap.has(channelId);
    }

    getWrappedUser(userId, name) {
        if (userId == this.WebClient.ClientUser.Id)
            return this.WebClient.ClientUser;

        if (this.userMap.has(userId)) {
            var user = this.userMap.get(userId);
            if (name)
                user.updateName(name);
            return user;
        }

        var user = new WebUser(userId, this.Namespace, name);
        this.userMap.set(userId, user);
        return user;
    }

    onDisconnect() {
        console.log(this.Socket.id + " is disconnected from storybot");

        this.WebClient.removeSocketHandler(this);
    }
}