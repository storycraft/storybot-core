import User from './user';
import UserMessage from '../message/user-message';
import { DMChannel } from 'discord.js';

export default class DiscordUser extends User {
    constructor(client, discordUser){
        super();

        this.client = client;
        this.discordUser = discordUser;
        this.dmChan = null;
    }

    get DiscordUser(){
        return this.discordUser;
    }

    get Id(){
        return this.DiscordUser.id;
    }

    get Tag(){
        return this.DiscordUser.tag;
    }

    get IdentityId(){
        return `discord:${this.Id}`;
    }

    get Name(){
        return this.DiscordUser.username;
    }

    get HasDMChannel(){
        return !!(this.dmChan);
    }

    async getDMChannel(){
        //DM Channel이 없을 경우 만든 후 캐싱
        return this.dmChan || (this.dmChan = new DiscordDMChannel(this.client, await this.DiscordUser.createDM()));
    }

    async send(msgTemplate){
        var dmChan = await this.getDMChannel();

        return dmChan.send(msgTemplate);
    }
}