import DiscordClient from './client/discord-client';
import { EventEmitter } from 'events';

import CommandManager from './command/command-manager';
import FirebaseManager from './io/firebase/firebase-manager';
import User from './user/user';
import SocketClient from './client/socket-client';
import AddonManager from './addon/addon-manager';

export default class Bot extends EventEmitter {
    constructor(){
        super();
        
        this.discord = null;
        this.line = null;
        this.facebookMessenger = null;
        this.socket = null;

        this.clients = [];

        this.commandManager = new CommandManager(this);
        this.addonManager = new AddonManager(this);
        this.firebaseManager = new FirebaseManager();
    }

    get CommandManager(){
        return this.commandManager;
    }

    get FirebaseManager(){
        return this.firebaseManager;
    }

    async initialize(settings){
        var tasks = [];

        if (settings['command-prefix'])//설정 존재시 덮어씌우기
            this.commandManager.commandPrefix = settings['command-prefix'];

        if (settings.discord.enabled){
            this.discord = new DiscordClient();
            this.addClient(this.discord);

            tasks.push(this.discord.initialize(settings.discord.userToken));
        }

        if (settings.line.enabled){
            //TODO
        }

        if (settings.facebook.enabled){
            //TODO
        }

        if (settings.socket.enabled) {
            this.socket = new SocketClient();
            this.addClient(this.socket);

            tasks.push(this.socket.initialize(settings.socket.port, settings.socket.path));
        }

        if (settings['firebase-enabled']){
            this.firebaseManager.initialize(settings['firebase']);
        }

        await Promise.all(tasks);

        this.emit('ready');
    }

    addClient(client){
        this.clients.push(client);
        client.on('message', this.onMessage.bind(this));
    }

    get DiscordClient(){
        return this.discord;
    }

    get LineClient(){
        return this.line;
    }

    get SocketClient(){
        return this.socket;
    }
    
    get FacebookMessenger(){
        return this.facebookMessenger;
    }

    onMessage(msg){
        this.emit('message', msg);
    }

    async destroy(){
        var tasks = [];

        if (this.discord)
            tasks.push(this.discord.destroy());

        if (this.line)
            tasks.push(this.line.destroy());

        if (this.facebookMessenger)
            tasks.push(this.facebookMessenger.destroy());

        await Promise.all(tasks);
    }
}