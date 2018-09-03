import Client, { ClientHandler } from "./client";
import http from 'http';
import SocketServer from "socket.io";
import SocketChannel from "../channel/socket-channel";
import { EventEmitter } from "events";
import SocketMessage from "../message/socket-message";
import SocketUser from "../user/socket-user";
import SocketClientUser from "./user/socket-client-user";

export default class SocketClient extends Client {
    constructor() {
        super();

        this.port = 0;

        this.httpServer = null;
        this.server = null;
        this.handler = new SocketClientHandler(this);

        this.socketMap = new Map();
        this.user = new SocketClientUser(this);

        this.clientMap = new Map();
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

    hasClientId(uuid) {
        return this.clientMap.has(uuid);
    }

    registerClientId(uuid, namespace) {
        if (this.hasClientId(uuid)) {
            var namespace = this.getClientNamespace(uuid);
            throw new Error(`${uuid} already taken by ${namespace}`);
        }

        this.clientMap.set(uuid, namespace);
    }

    getClientNamespace(uuid) {
        if (!this.hasClientId(uuid))
            return null;

        return this.clientMap.get(uuid);
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

    async initialize(port, path){
        if (this.Ready || this.Initializing)
            throw new Error('해당 클라이언트는 이미 활성화 되어있거나 초기화 중입니다');
        this.initializing = true;
        
        this.port = port || 7000;
        this.httpServer = http.createServer();
        this.server = new SocketServer(this.httpServer, {
            path: path || '/storybot-socket',
            serveClient: false
        });
        this.httpServer.listen(this.port);

        await this.handler.initialize();

        this.initializing = false;
        this.ready = true;

        console.log(`Socket 클라이언트가 포트 ${this.port} 로 초기화 되었습니다`);

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

export class SocketClientHandler extends ClientHandler {
    constructor(socketclient) {
        super(socketclient);
    }

    get SocketServer(){
        return this.Client.Server;
    }

    get BotSocket() {
        return this.SocketServer.sockets;
    }

    async initialize() {
        this.BotSocket.on('connect', this.onConnected.bind(this));
    }

    onConnected(socket) {
        console.log(socket.id + " is connected to storybot");

        var handler = this.Client.addSocketHandler(socket);

        /*
        get

        {
            "client-uuid": "73ace10f-b60c-4d7f-96a5-0c2f479959bd", <- this is unique id
            "service": "socket testing"
        }
        */

        /*
        response

        {
            "status": 0, //0 on success 1 on failed
            "namespace": "asdf",
        }
        */
        socket.on('initialize', (jsonData) => {
            try {
                if (!handler.Initialized) {
                    var clientId = jsonData['client-uuid'];
                    if (!this.Client.hasClientId(clientId)) {
                        handler.Socket.emit('initialize', {
                            status: 1
                        });

                        throw new Error(`Unknown socket client ${clientId} rejecting`);
                    }

                    var namespace = this.Client.getClientNamespace(clientId);
                    handler.initialize(namespace, jsonData.service);
                    handler.Socket.emit('initialize', {
                        status: 0,
                        namespace: namespace
                    });

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
    constructor(socketClient, socket, namespace = null) {
        super();
        this.socketClient = socketClient;
        this.socket = socket;

        this.namespace = namespace;
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

    get SocketClient() {
        return this.socketClient;
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

            var user = this.getWrappedUser(rawUser.id, rawUser.nickname);

            var channel = null;
            if (this.hasChannel(rawChannel.id)) {
                channel = this.getChannel(rawChannel.id, rawChannel.name);
            }
            else {
                channel = this.addChannel(rawChannel.id, rawChannel.name);
            }

            if (rawMessage.text) {
                var message = new SocketMessage(rawMessage.text, rawMessage.timestamp, channel, user);

                this.emit('message', message);
                this.SocketClient.emit('message', message);
                channel.emit('message', message);
                user.emit('message', message);
            }

            for (var attachment of rawMessage.attachments) {
                var message = new SocketMessage('', rawMessage.timestamp, channel, user);

                this.emit('message', message);
                this.SocketClient.emit('message', message);
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
        "user": {
            "id": 178293671283,
            "nickname": "asdf" 
        },
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

    addChannel(channelId, name) {
        if (this.hasChannel(channelId))
            return this.getChannel(channelId);
            
        var socketChannel = new SocketChannel(this.SocketClient, this, channelId, name ? name : 'Unknown Channel');

        this.channelMap.set(channelId, socketChannel);

        return socketChannel;
    }

    getChannel(channelId, updateName) {
        if (!this.hasChannel(channelId))
            return null;

        var channel = this.channelMap.get(channelId);

        if (updateName) {
            channel.updateName(updateName);
        }

        return channel;
    }

    hasChannel(channelId) {
        return this.channelMap.has(channelId);
    }

    getWrappedUser(userId, name) {
        if (userId == this.SocketClient.ClientUser.Id)
            return this.SocketClient.ClientUser;

        if (this.userMap.has(userId)) {
            var user = this.userMap.get(userId);
            if (name)
                user.updateName(name);
            return user;
        }

        var user = new SocketUser(userId, this.Namespace, name ? name : 'Unknown User');
        this.userMap.set(userId, user);
        return user;
    }

    onDisconnect() {
        console.log(this.Socket.id + " is disconnected from storybot");

        this.SocketClient.removeSocketHandler(this);
    }
}