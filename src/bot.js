import DiscordClient from './client/discord-client';
import { EventEmitter } from 'events';

import { MessageTemplate, Attachment as MessageAttachment } from './message/template/message-template';
import CommandManager from './command/command-manager';

export default class Bot extends EventEmitter {
    constructor(){
        super();
        
        this.discord = null;
        this.line = null;
        this.facebookMessenger = null;

        this.commandManager = new CommandManager(this);
    }

    get CommandManager(){
        return this.commandManager;
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

        if (settings.line.enabled){
            //TODO
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

export { MessageTemplate, MessageAttachment }