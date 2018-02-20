import DiscordClient from './client/discord-client';
import { EventEmitter } from 'events';

import { MessageTemplate, Attachment as MessageAttachment } from './message/template/message-template';

export default class Bot extends EventEmitter {
    constructor(){
        this.discord = null;
        this.line = null;
        this.facebookMessenger = null;
    }

    async initialize(settings){
        var tasks = [];

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

        EventEmitter.emit('ready');
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
        EventEmitter.emit('message', msg);
    }
}

export { MessageTemplate, MessageAttachment }