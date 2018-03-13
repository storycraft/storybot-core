import DiscordClient from './client/discord-client';
import { EventEmitter } from 'events';

import CommandManager from './command/command-manager';
import FirebaseManager from './io/firebase/firebase-manager';

export default class Bot extends EventEmitter {
    constructor(){
        super();
        
        this.discord = null;
        this.line = null;
        this.facebookMessenger = null;

        this.commandManager = new CommandManager(this);
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

            this.discord.on('message', this.onMessage.bind(this));

            tasks.push(this.discord.initialize(settings.discord.userToken));
        }

        if (settings.line.enabled){
            //TODO
        }

        if (settings.facebook.enabled){
            //TODO
        }

        if (settings['firebase-enabled']){
            this.firebaseManager.initialize(settings['firebase']);
        }

        await Promise.all(tasks);

        this.emit('ready');
    }

    get DiscordClient(){
        return this.discord;
    }

    get LineClient(){
        return this.line;
    }
    
    get FacebookMessenger(){
        return this.facebookMessenger;
    }

    addClient(client){

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